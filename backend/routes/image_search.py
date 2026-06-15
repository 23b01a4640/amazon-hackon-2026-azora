from fastapi import APIRouter, File, UploadFile, Form
from database.supabase_client import supabase
from services.groq_service import client
import base64
import json
from typing import Optional

router = APIRouter()

VISION_PROMPT = """Look at this image and tell me what objects or products you can see.

Return a simple JSON with:
1. "product" - the main product you see (e.g., "shirt", "sunscreen", "running shoes")
2. "category" - the product category (e.g., "clothing", "skincare", "footwear")
3. "keywords" - a list of 3-6 general product names/types you see (e.g., "shoes", "bottle", "lamp", "pillow", "notebook")
4. "mission" - if the image represents a life goal, pick one: "New Apartment", "Start Running", "Pasta Preparation", "College Starter", "Skincare". Otherwise use "Direct Product".

Return ONLY valid JSON:
{"product": "main product", "category": "category", "mission": "mission name", "keywords": ["keyword1", "keyword2", "keyword3"]}

Keep keywords simple and generic. No explanation. No markdown. JSON only."""

INTENT_PROMPT = """You are an intent classifier for a visual product search system.

A user uploaded an image of a product and also typed a text query. Based on the text query, classify the user's intent.

Detected product from image: "{product}"
Product category: "{category}"
User's text query: "{query}"

Classify the intent into EXACTLY ONE of:
1. "similar" - User wants similar products from the same category (e.g., "Find similar shirts", "Show me more like this")
2. "complementary" - User wants a specific complementary product (e.g., "Suggest pants for this shirt", "What moisturizer goes with this sunscreen")
3. "bundle" - User wants a complete bundle/routine built around this product (e.g., "Build a skincare routine around this", "Create an outfit using this")

Also extract the target category the user is looking for (if specified).

Return ONLY valid JSON:
{{"intent": "similar|complementary|bundle", "target_category": "the category user wants or null", "target_keywords": ["keyword1", "keyword2"]}}

Examples:
- Query: "Find similar shirts" → {{"intent": "similar", "target_category": null, "target_keywords": ["shirt"]}}
- Query: "Suggest pants for this shirt" → {{"intent": "complementary", "target_category": "pants", "target_keywords": ["pants", "trousers"]}}
- Query: "What shoes go with this dress?" → {{"intent": "complementary", "target_category": "footwear", "target_keywords": ["shoes"]}}
- Query: "Build a skincare routine around this sunscreen" → {{"intent": "bundle", "target_category": null, "target_keywords": ["cleanser", "moisturizer", "toner", "serum"]}}
- Query: "Create an outfit using this shirt" → {{"intent": "bundle", "target_category": null, "target_keywords": ["pants", "shoes", "belt", "watch"]}}
- Query: "Recommend a moisturizer for this sunscreen" → {{"intent": "complementary", "target_category": "moisturizer", "target_keywords": ["moisturizer", "cream"]}}

No explanation. JSON only."""


def analyze_image(image_base64: str) -> dict:
    """Use Groq Vision to analyze an uploaded image."""
    if not client:
        return None

    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": VISION_PROMPT},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            },
                        },
                    ],
                }
            ],
            temperature=0,
            max_tokens=200,
        )

        result = response.choices[0].message.content.strip()

        # Handle markdown code blocks
        if result.startswith("```"):
            result = result.split("```")[1]
            if result.startswith("json"):
                result = result[4:]
            result = result.strip()

        parsed = json.loads(result)
        return parsed

    except Exception as e:
        print(f"Groq Vision error: {e}")
        return None


def classify_intent(product: str, category: str, query: str) -> dict:
    """Use Groq LLM to classify user intent from text query."""
    if not client or not query:
        return {"intent": "similar", "target_category": None, "target_keywords": []}

    try:
        prompt = INTENT_PROMPT.format(product=product, category=category, query=query)

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an intent classifier. Return only valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0,
            max_tokens=150,
        )

        result = response.choices[0].message.content.strip()

        # Handle markdown code blocks
        if result.startswith("```"):
            result = result.split("```")[1]
            if result.startswith("json"):
                result = result[4:]
            result = result.strip()

        parsed = json.loads(result)
        return parsed

    except Exception as e:
        print(f"Intent classification error: {e}")
        return {"intent": "similar", "target_category": None, "target_keywords": []}


def search_products_by_keywords(keywords: list) -> list:
    """Search products table using detected keywords broadly."""
    seen_ids = set()
    all_products = []

    # Build a broader set of search terms from keywords
    search_terms = set()
    for keyword in keywords:
        search_terms.add(keyword)
        # Also add individual words (e.g., "water bottle" -> "water", "bottle")
        words = keyword.split()
        for word in words:
            if len(word) > 3:
                search_terms.add(word)

    for term in search_terms:
        # Search by name
        name_resp = (
            supabase.table("products")
            .select("*")
            .ilike("name", f"%{term}%")
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
            .ilike("category", f"%{term}%")
            .execute()
        )
        for p in cat_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                all_products.append(p)

        # Search by description
        desc_resp = (
            supabase.table("products")
            .select("*")
            .ilike("description", f"%{term}%")
            .execute()
        )
        for p in desc_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                all_products.append(p)

    # Sort by rating
    all_products.sort(key=lambda p: (-p.get("rating", 0), p.get("price", 0)))
    return all_products


def search_complementary_products(target_keywords: list, target_category: str, detected_product: str) -> list:
    """Search for complementary products based on target category/keywords, excluding the detected product."""
    seen_ids = set()
    all_products = []

    search_terms = set()
    if target_category:
        search_terms.add(target_category)
    for kw in target_keywords:
        search_terms.add(kw)
        words = kw.split()
        for word in words:
            if len(word) > 3:
                search_terms.add(word)

    for term in search_terms:
        name_resp = (
            supabase.table("products")
            .select("*")
            .ilike("name", f"%{term}%")
            .execute()
        )
        for p in name_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                all_products.append(p)

        cat_resp = (
            supabase.table("products")
            .select("*")
            .ilike("category", f"%{term}%")
            .execute()
        )
        for p in cat_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                all_products.append(p)

        desc_resp = (
            supabase.table("products")
            .select("*")
            .ilike("description", f"%{term}%")
            .execute()
        )
        for p in desc_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                all_products.append(p)

    # Exclude products that are the same as the detected product
    detected_lower = detected_product.lower()
    all_products = [p for p in all_products if detected_lower not in p.get("name", "").lower()]

    all_products.sort(key=lambda p: (-p.get("rating", 0), p.get("price", 0)))
    return all_products


def build_bundle(detected_product: str, detected_category: str, target_keywords: list) -> dict:
    """Build a bundle of complementary products around the detected product."""
    bundle_products = {}

    for keyword in target_keywords:
        seen_ids = set()
        products_for_category = []

        # Search by name
        name_resp = (
            supabase.table("products")
            .select("*")
            .ilike("name", f"%{keyword}%")
            .execute()
        )
        for p in name_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                products_for_category.append(p)

        # Search by category
        cat_resp = (
            supabase.table("products")
            .select("*")
            .ilike("category", f"%{keyword}%")
            .execute()
        )
        for p in cat_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                products_for_category.append(p)

        # Search by description
        desc_resp = (
            supabase.table("products")
            .select("*")
            .ilike("description", f"%{keyword}%")
            .execute()
        )
        for p in desc_resp.data:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                products_for_category.append(p)

        # Exclude the original detected product
        detected_lower = detected_product.lower()
        products_for_category = [
            p for p in products_for_category 
            if detected_lower not in p.get("name", "").lower()
        ]

        if products_for_category:
            # Sort by rating and pick top product for each category
            products_for_category.sort(key=lambda p: (-p.get("rating", 0), p.get("price", 0)))
            bundle_products[keyword] = products_for_category[:2]  # Top 2 per category

    # Flatten bundle into a list
    all_bundle_products = []
    seen_ids = set()
    for category_products in bundle_products.values():
        for p in category_products:
            if p["id"] not in seen_ids:
                seen_ids.add(p["id"])
                all_bundle_products.append(p)

    return all_bundle_products


@router.post("/image-search")
async def image_search(
    image: UploadFile = File(...),
    query: Optional[str] = Form(default=None)
):
    """Analyze uploaded image with intent-aware search based on optional text query."""
    try:
        # Read and encode the image
        image_bytes = await image.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Analyze with Groq Vision
        analysis = analyze_image(image_base64)

        if not analysis:
            return {
                "mission": "Unknown",
                "intent": "similar",
                "detected_product": None,
                "detected_category": None,
                "detected_categories": [],
                "products": []
            }

        mission = analysis.get("mission", "Unknown")
        keywords = analysis.get("keywords", [])
        detected_product = analysis.get("product", keywords[0] if keywords else "unknown")
        detected_category = analysis.get("category", "general")

        # If no text query provided, default to similar product search (current behavior)
        if not query or not query.strip():
            products = search_products_by_keywords(keywords)

            if not products and mission not in ["Unknown", "Direct Product"]:
                mission_resp = (
                    supabase.table("products")
                    .select("*")
                    .eq("mission", mission)
                    .execute()
                )
                products = mission_resp.data

            return {
                "mission": mission,
                "intent": "similar",
                "detected_product": detected_product,
                "detected_category": detected_category,
                "detected_categories": keywords,
                "products": products[:15]
            }

        # Text query provided - classify intent
        intent_result = classify_intent(detected_product, detected_category, query.strip())
        intent = intent_result.get("intent", "similar")
        target_category = intent_result.get("target_category")
        target_keywords = intent_result.get("target_keywords", [])

        if intent == "similar":
            # Search same category products
            products = search_products_by_keywords(keywords)
            if not products and mission not in ["Unknown", "Direct Product"]:
                mission_resp = (
                    supabase.table("products")
                    .select("*")
                    .eq("mission", mission)
                    .execute()
                )
                products = mission_resp.data

            return {
                "mission": mission,
                "intent": "similar",
                "detected_product": detected_product,
                "detected_category": detected_category,
                "detected_categories": keywords,
                "products": products[:15]
            }

        elif intent == "complementary":
            # Search for the complementary product type
            products = search_complementary_products(target_keywords, target_category, detected_product)

            return {
                "mission": mission,
                "intent": "complementary",
                "detected_product": detected_product,
                "detected_category": detected_category,
                "target_category": target_category,
                "detected_categories": target_keywords,
                "products": products[:15]
            }

        elif intent == "bundle":
            # Build a complete bundle/routine
            bundle_products = build_bundle(detected_product, detected_category, target_keywords)

            return {
                "mission": mission,
                "intent": "bundle",
                "detected_product": detected_product,
                "detected_category": detected_category,
                "detected_categories": target_keywords,
                "products": bundle_products[:20]
            }

        # Fallback
        products = search_products_by_keywords(keywords)
        return {
            "mission": mission,
            "intent": intent,
            "detected_product": detected_product,
            "detected_category": detected_category,
            "detected_categories": keywords,
            "products": products[:15]
        }

    except Exception as e:
        print(f"Image search error: {e}")
        return {
            "mission": "Unknown",
            "intent": "similar",
            "detected_product": None,
            "detected_category": None,
            "detected_categories": [],
            "products": []
        }
