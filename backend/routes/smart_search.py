from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from database.supabase_client import supabase
from services.groq_service import client as groq_client
from services.memory_service import get_user_memory
import re
import json

router = APIRouter()


class SmartSearchRequest(BaseModel):
    query: str
    answers: Optional[List[str]] = []
    user_id: Optional[str] = None


def extract_budget(answers: List[str]) -> Optional[int]:
    """Extract budget value from answers like '₹5000', 'Under ₹500', '₹500-₹1000', '₹3000+'."""
    for answer in answers:
        # Only consider answers that contain ₹ symbol or budget-related words
        if '₹' in answer or re.search(r'\b(budget|under|below|max|upto|up to)\b', answer, re.IGNORECASE):
            numbers = re.findall(r'\d+', answer.replace(",", ""))
            if numbers:
                return int(numbers[-1])
    return None


def extract_filter_keywords(answers: List[str]) -> List[str]:
    """Extract meaningful filter keywords from non-budget answers."""
    keywords = []
    for answer in answers:
        # Skip only if it looks like a budget answer (contains ₹ or budget-related words)
        if '₹' in answer or re.search(r'\b(budget|under|below|max|upto|up to)\b', answer, re.IGNORECASE):
            continue
        # Skip generic yes/no answers
        if answer.lower().strip() in ["yes", "no", "both", "beginner", "intermediate", "advanced", "experienced"]:
            continue
        # This is a meaningful filter keyword (e.g., "SPF 30", "Glass", "Insulated", "Memory Foam")
        keywords.append(answer.lower().strip())
    return keywords


def ai_filter_products(products: list, query: str, answers: List[str]) -> list:
    """Use Groq LLM to filter products based on user preferences."""
    if not groq_client or not products:
        return products

    try:
        product_list = []
        for i, p in enumerate(products):
            product_list.append(f"{i}. {p.get('name', '')} - {p.get('description', '')}")
        
        products_text = "\n".join(product_list)
        answers_text = ", ".join(answers)

        prompt = f"""Given a user searching for "{query}" with these preferences: [{answers_text}]

Here are the available products:
{products_text}

Return ONLY the indices (numbers) of products that match the user's preferences. 
If user said "SPF 30", only return SPF 30 products, NOT SPF 50.
If user said a specific type/variant, only return that exact type.
Be strict - only include products that match what the user asked for.

Return as a JSON array of numbers, e.g. [0, 2, 4]
Return ONLY the JSON array, nothing else."""

        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a product filter. Return only a JSON array of matching product indices. Be strict about matching user preferences."},
                {"role": "user", "content": prompt},
            ],
            temperature=0,
            max_tokens=100,
        )

        result = response.choices[0].message.content.strip()
        # Parse the JSON array from the response
        indices = json.loads(result)
        
        if isinstance(indices, list) and len(indices) > 0:
            filtered = [products[i] for i in indices if isinstance(i, int) and 0 <= i < len(products)]
            if filtered:
                return filtered
    except Exception as e:
        print(f"AI filter error: {e}")

    return products


@router.post("/products/smart-search")
def smart_search(request: SmartSearchRequest):
    query = request.query
    answers = request.answers or []

    # Search by name and category using the primary query
    seen_ids = set()
    all_products = []

    # Search by name
    name_resp = (
        supabase.table("products")
        .select("*")
        .ilike("name", f"%{query}%")
        .execute()
    )
    for p in name_resp.data:
        if p["id"] not in seen_ids:
            seen_ids.add(p["id"])
            all_products.append(p)

    # Search by category
    cat_resp = (
        supabase.table("products")
        .select("*")
        .ilike("category", f"%{query}%")
        .execute()
    )
    for p in cat_resp.data:
        if p["id"] not in seen_ids:
            seen_ids.add(p["id"])
            all_products.append(p)

    # Only search description if no name/category results found
    if not all_products:
        desc_resp = (
            supabase.table("products")
            .select("*")
            .ilike("description", f"%{query}%")
            .execute()
        )
        for p in desc_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                all_products.append(p)

    if not all_products:
        return []

    # Budget filtering — prefer products within budget, but don't return empty
    budget = extract_budget(answers)
    if budget:
        within_budget = [p for p in all_products if p["price"] <= budget]
        if within_budget:
            all_products = within_budget
        else:
            # No products within budget — sort by price (cheapest first) so user sees closest options
            all_products.sort(key=lambda p: p.get("price", 0))

    if not all_products:
        return []

    # Filter by answer keywords (e.g., "SPF 30", "Glass", "Insulated", "Spiral")
    filter_keywords = extract_filter_keywords(answers)
    if filter_keywords:
        # Score products by how well they match filter keywords
        filtered = []
        unfiltered = []
        for product in all_products:
            product_text = f"{product.get('name', '')} {product.get('description', '')} {product.get('category', '')}".lower()
            # Normalize: remove hyphens/underscores for matching
            product_text_normalized = re.sub(r'[-_/]', ' ', product_text)
            product_text_nospace = product_text.replace(' ', '').replace('-', '').replace('_', '')
            
            matches = 0
            for kw in filter_keywords:
                kw_normalized = re.sub(r'[-_/]', ' ', kw)
                kw_nospace = kw.replace(' ', '').replace('-', '').replace('_', '')
                # Try exact substring, normalized, or no-space match
                if kw in product_text or kw_normalized in product_text_normalized or kw_nospace in product_text_nospace:
                    matches += 1
            
            if matches > 0:
                product["_match_score"] = matches
                filtered.append(product)
            else:
                unfiltered.append(product)

        # Strict filtering: ONLY return matching products
        if filtered:
            filtered.sort(key=lambda p: (-p.get("_match_score", 0), -p.get("rating", 0), p.get("price", 0)))
            for p in filtered:
                p.pop("_match_score", None)
            all_products = filtered
        else:
            # No text matches found - use AI to semantically filter products
            all_products = ai_filter_products(all_products, query, answers)
            all_products.sort(key=lambda p: (-p.get("rating", 0), p.get("price", 0)))
    else:
        # No filter keywords — sort by rating
        all_products.sort(key=lambda p: (-p.get("rating", 0), p.get("price", 0)))

    # Return top results (max 10)
    # Apply repurchase-aware filtering if user_id is provided
    if request.user_id:
        memory = get_user_memory(request.user_id)
        non_repurchasable = set(p.lower() for p in memory.get("non_repurchasable_purchases", []))
        removed = set(p.lower() for p in memory.get("removed_products", []))
        exclude = non_repurchasable | removed

        if exclude:
            filtered = [p for p in all_products if p["name"].lower() not in exclude]
            # Only apply if we still have results
            if filtered:
                all_products = filtered

    return all_products[:10]
