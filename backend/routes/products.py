from fastapi import APIRouter
from database.supabase_client import supabase

router = APIRouter()


@router.get("/products")
def get_products():
    response = supabase.table("products").select("*").execute()
    return response.data


@router.get("/products/mission/{mission_name}")
def get_products_by_mission(mission_name: str):
    response = (
        supabase.table("products")
        .select("*")
        .eq("mission", mission_name)
        .execute()
    )
    return response.data


@router.get("/products/search")
def search_products(query: str):
    # Search by name (strongest match)
    name_response = (
        supabase.table("products")
        .select("*")
        .ilike("name", f"%{query}%")
        .execute()
    )

    # Search by category (strong match)
    category_response = (
        supabase.table("products")
        .select("*")
        .ilike("category", f"%{query}%")
        .execute()
    )

    # Merge name + category results (primary results)
    seen_ids = set()
    results = []

    for product in name_response.data + category_response.data:
        if product["id"] not in seen_ids:
            seen_ids.add(product["id"])
            results.append(product)

    # Only search description if no name/category matches found
    if not results:
        description_response = (
            supabase.table("products")
            .select("*")
            .ilike("description", f"%{query}%")
            .execute()
        )
        for product in description_response.data:
            if product["id"] not in seen_ids:
                seen_ids.add(product["id"])
                results.append(product)

    return results
