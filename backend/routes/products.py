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
    # Search by name
    name_response = (
        supabase.table("products")
        .select("*")
        .ilike("name", f"%{query}%")
        .execute()
    )

    # Search by category
    category_response = (
        supabase.table("products")
        .select("*")
        .ilike("category", f"%{query}%")
        .execute()
    )

    # Search by description
    description_response = (
        supabase.table("products")
        .select("*")
        .ilike("description", f"%{query}%")
        .execute()
    )

    # Merge results, deduplicate by id
    seen_ids = set()
    results = []

    for product in name_response.data + category_response.data + description_response.data:
        if product["id"] not in seen_ids:
            seen_ids.add(product["id"])
            results.append(product)

    return results
