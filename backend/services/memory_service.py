from database.supabase_client import supabase
from typing import Optional


# Category classification for repurchase-aware recommendations
REPURCHASABLE_CATEGORIES = [
    "Skincare",
    "Fitness Nutrition",
    "Personal Care",
    "Grocery",
]

NON_REPURCHASABLE_CATEGORIES = [
    "Clothing",
    "Electronics",
    "Furniture",
    "Backpack",
    "Monitor",
    "Study Essentials",
    "Computer Accessories",
    "Laptop Accessories",
    "Storage",
    "Home Decor",
]


def is_repurchasable_category(category: str) -> bool:
    """Check if a product category is repurchasable (consumable/recurring)."""
    if not category:
        return False
    category_lower = category.lower()
    for repurchasable in REPURCHASABLE_CATEGORIES:
        if repurchasable.lower() in category_lower or category_lower in repurchasable.lower():
            return True
    return False


def get_user_memory(user_id: str) -> dict:
    """Fetch and summarize a user's complete shopping memory."""
    memory = {
        "past_purchases": [],
        "past_purchases_with_category": [],
        "non_repurchasable_purchases": [],
        "removed_products": [],
        "budget_preference": "unknown",
        "preferred_brands": [],
        "preferred_categories": [],
    }

    if not user_id:
        return memory

    # Fetch purchase history
    purchases_resp = (
        supabase.table("user_purchases")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    purchases = purchases_resp.data or []

    # Fetch interactions (removed/added)
    interactions_resp = (
        supabase.table("user_interactions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    interactions = interactions_resp.data or []

    # Past purchases - all product names
    memory["past_purchases"] = [p["product_name"] for p in purchases]

    # Past purchases with category info
    memory["past_purchases_with_category"] = [
        {"name": p["product_name"], "category": p.get("category", "")}
        for p in purchases
    ]

    # Non-repurchasable purchases - only these should be excluded from recommendations
    memory["non_repurchasable_purchases"] = [
        p["product_name"]
        for p in purchases
        if not is_repurchasable_category(p.get("category", ""))
    ]

    # Removed products
    memory["removed_products"] = [
        i["product_name"] for i in interactions if i["action"] == "removed"
    ]

    # Budget preference - analyze average purchase price
    if purchases:
        prices = [p["price"] for p in purchases if p.get("price")]
        if prices:
            avg_price = sum(prices) / len(prices)
            if avg_price < 500:
                memory["budget_preference"] = "budget-friendly"
            elif avg_price < 1500:
                memory["budget_preference"] = "medium"
            else:
                memory["budget_preference"] = "premium"

    # Preferred brands - most frequently purchased
    if purchases:
        brand_count = {}
        for p in purchases:
            brand = p.get("brand")
            if brand:
                brand_count[brand] = brand_count.get(brand, 0) + 1
        # Top 3 brands
        sorted_brands = sorted(brand_count.items(), key=lambda x: -x[1])
        memory["preferred_brands"] = [b[0] for b in sorted_brands[:3]]

    # Preferred categories
    if purchases:
        cat_count = {}
        for p in purchases:
            cat = p.get("category")
            if cat:
                cat_count[cat] = cat_count.get(cat, 0) + 1
        sorted_cats = sorted(cat_count.items(), key=lambda x: -x[1])
        memory["preferred_categories"] = [c[0] for c in sorted_cats[:5]]

    return memory


def build_memory_prompt(memory: dict) -> str:
    """Convert user memory into a prompt context string for Groq."""
    parts = []

    if memory["past_purchases"]:
        parts.append(f"Previously purchased: {', '.join(memory['past_purchases'][:10])}")

    if memory["removed_products"]:
        parts.append(f"Products user dislikes/removed: {', '.join(memory['removed_products'][:5])}")

    if memory["budget_preference"] != "unknown":
        parts.append(f"Budget preference: {memory['budget_preference']}")

    if memory["preferred_brands"]:
        parts.append(f"Preferred brands: {', '.join(memory['preferred_brands'])}")

    if memory["preferred_categories"]:
        parts.append(f"Frequently purchased categories: {', '.join(memory['preferred_categories'])}")

    if not parts:
        return ""

    return "USER HISTORY:\n" + "\n".join(parts)
