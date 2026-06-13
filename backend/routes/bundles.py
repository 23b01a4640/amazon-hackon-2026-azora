from fastapi import APIRouter
from database.supabase_client import supabase

router = APIRouter()

@router.get("/bundles/{mission_name}")
def get_bundle(mission_name: str):

    response = (
        supabase.table("products")
        .select("*")
        .eq("mission", mission_name)
        .execute()
    )

    products = response.data

    products = sorted(products, key=lambda x: x["price"])

    essentials = products[:3]

    best_value = products[3:7]

    premium = products[7:]

    return {
        "mission": mission_name,
        "essentials": essentials,
        "best_value": best_value,
        "premium": premium
    }