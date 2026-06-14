from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from database.supabase_client import supabase
import re

router = APIRouter()


class SmartSearchRequest(BaseModel):
    query: str
    answers: Optional[List[str]] = []


def extract_budget(answers: List[str]) -> Optional[int]:
    """Extract budget value from answers like '₹5000', 'Under ₹500', '₹500-₹1000', '₹3000+'."""
    for answer in answers:
        # Find all numbers in the answer
        numbers = re.findall(r'\d+', answer.replace(",", ""))
        if numbers:
            # Use the largest number as the max budget
            return int(numbers[-1])
    return None


def extract_filter_keywords(answers: List[str]) -> List[str]:
    """Extract meaningful filter keywords from non-budget answers."""
    keywords = []
    for answer in answers:
        # Skip if it contains currency/numbers (budget answer)
        if re.search(r'[₹\d]', answer.replace(",", "")):
            continue
        # Skip generic yes/no answers
        if answer.lower().strip() in ["yes", "no", "both", "beginner", "intermediate", "advanced", "experienced"]:
            continue
        # This is a meaningful filter keyword (e.g., "Glass", "Insulated", "Spiral", "Memory Foam")
        keywords.append(answer.lower().strip())
    return keywords


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

    # Filter by answer keywords (e.g., "Glass", "Insulated", "Spiral")
    filter_keywords = extract_filter_keywords(answers)
    if filter_keywords:
        # Score products by how well they match filter keywords
        filtered = []
        unfiltered = []
        for product in all_products:
            product_text = f"{product.get('name', '')} {product.get('description', '')} {product.get('category', '')}".lower()
            matches = sum(1 for kw in filter_keywords if kw in product_text)
            if matches > 0:
                product["_match_score"] = matches
                filtered.append(product)
            else:
                unfiltered.append(product)

        # Prefer matching products, but fall back to all if none match
        if filtered:
            filtered.sort(key=lambda p: (-p.get("_match_score", 0), -p.get("rating", 0), p.get("price", 0)))
            for p in filtered:
                p.pop("_match_score", None)
            all_products = filtered
        else:
            # No keyword matches — return all products (sorted by rating)
            all_products.sort(key=lambda p: (-p.get("rating", 0), p.get("price", 0)))
    else:
        # No filter keywords — sort by rating
        all_products.sort(key=lambda p: (-p.get("rating", 0), p.get("price", 0)))

    # Return top results (max 10)
    return all_products[:10]
