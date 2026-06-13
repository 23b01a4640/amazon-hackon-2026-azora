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
    response = (
        supabase.table("products")
        .select("*")
        .ilike("name", f"%{query}%")
        .execute()
    )

    return response.data