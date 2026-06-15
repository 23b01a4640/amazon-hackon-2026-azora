from fastapi import APIRouter
from typing import Optional
from database.supabase_client import supabase
from services.memory_service import get_user_memory, build_memory_prompt
from services.groq_service import client

router = APIRouter()


def personalize_bundle(products: list, memory: dict) -> list:
    """Remove only non-repurchasable purchased products and disliked products from a bundle.
    
    Repurchasable products (skincare, personal care, etc.) remain eligible
    even if previously purchased. Non-repurchasable products (clothing, 
    electronics, furniture, etc.) are excluded if already purchased.
    """
    # Only exclude non-repurchasable past purchases (not consumables like sunscreen)
    non_repurchasable = set(p.lower() for p in memory.get("non_repurchasable_purchases", []))
    removed = set(p.lower() for p in memory.get("removed_products", []))
    exclude = non_repurchasable | removed

    filtered = [p for p in products if p["name"].lower() not in exclude]

    # If filtering removed too many, return original (avoid empty bundles)
    if len(filtered) < 1:
        return products

    # Prioritize preferred brands
    preferred_brands = set(b.lower() for b in memory.get("preferred_brands", []))
    if preferred_brands:
        filtered.sort(key=lambda p: (
            0 if p.get("brand", "").lower() in preferred_brands else 1,
            -p.get("rating", 0),
            p.get("price", 0)
        ))

    return filtered


@router.get("/bundles/{mission_name}")
def get_bundle(mission_name: str, user_id: Optional[str] = None):
    # Fetch all mission products
    response = (
        supabase.table("products")
        .select("*")
        .eq("mission", mission_name)
        .execute()
    )

    products = response.data
    products = sorted(products, key=lambda x: x["price"])

    # Get user memory if user_id provided
    memory = get_user_memory(user_id) if user_id else {}

    # Personalize if user has history
    if memory.get("past_purchases") or memory.get("removed_products"):
        products = personalize_bundle(products, memory)
        products = sorted(products, key=lambda x: x["price"])

    # Split into tiers
    total = len(products)
    third = max(total // 3, 1)

    essentials = products[:third]
    best_value = products[third:third*2]
    premium = products[third*2:]

    return {
        "mission": mission_name,
        "essentials": essentials,
        "best_value": best_value,
        "premium": premium,
        "personalized": bool(memory.get("past_purchases") or memory.get("removed_products")),
    }
