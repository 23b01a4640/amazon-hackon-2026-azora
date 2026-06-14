from fastapi import APIRouter, File, UploadFile
from database.supabase_client import supabase
from services.groq_service import client
import base64
import json

router = APIRouter()

VISION_PROMPT = """Look at this image and tell me what objects or products you can see.

Return a simple JSON with:
1. "keywords" - a list of 3-6 general product names/types you see (e.g., "shoes", "bottle", "lamp", "pillow", "notebook")
2. "mission" - if the image represents a life goal, pick one: "New Apartment", "Start Running", "Pasta Preparation", "College Starter", "Skincare". Otherwise use "Direct Product".

Return ONLY valid JSON:
{"mission": "mission name", "keywords": ["keyword1", "keyword2", "keyword3"]}

Keep keywords simple and generic. Example:
- Photo of a desk with books and pen → {"mission": "College Starter", "keywords": ["notebook", "pen", "lamp", "backpack"]}
- Photo of running shoes → {"mission": "Start Running", "keywords": ["running shoes", "water bottle", "t-shirt"]}
- Photo of a single water bottle → {"mission": "Direct Product", "keywords": ["water bottle"]}

No explanation. No markdown. JSON only."""


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


def search_products_by_keywords(keywords: list) -> list:
    """Search products table using detected keywords broadly."""
    seen_ids = set()
    all_products = []

    # Build a broader set of search terms from keywords
    search_terms = set()
    for keyword in keywords:
        search_terms.add(keyword)
        # Also add individual words (e.g., "water bottle" → "water", "bottle")
        words = keyword.split()
        for word in words:
            if len(word) > 3:  # Skip short words like "a", "the", "for"
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


@router.post("/image-search")
async def image_search(image: UploadFile = File(...)):
    """Analyze uploaded image and return matching products."""
    try:
        # Read and encode the image
        image_bytes = await image.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Analyze with Groq Vision
        analysis = analyze_image(image_base64)

        if not analysis:
            return {
                "mission": "Unknown",
                "detected_categories": [],
                "products": []
            }

        mission = analysis.get("mission", "Unknown")
        keywords = analysis.get("keywords", [])

        # Search products using the detected keywords
        products = search_products_by_keywords(keywords)

        # If no keyword matches, try fetching all products for the mission
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
            "detected_categories": keywords,
            "products": products[:15]
        }

    except Exception as e:
        print(f"Image search error: {e}")
        return {
            "mission": "Unknown",
            "detected_categories": [],
            "products": []
        }
