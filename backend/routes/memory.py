from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from database.supabase_client import supabase

router = APIRouter()


class PurchaseRecord(BaseModel):
    user_id: str
    product_name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[int] = None
    mission: Optional[str] = None


class InteractionRecord(BaseModel):
    user_id: str
    action: str  # "selected", "removed", "added"
    product_name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    mission: Optional[str] = None


@router.post("/memory/purchase")
def save_purchase(record: PurchaseRecord):
    """Save a product purchase to user history."""
    try:
        supabase.table("user_purchases").insert({
            "user_id": record.user_id,
            "product_name": record.product_name,
            "category": record.category,
            "brand": record.brand,
            "price": record.price,
            "mission": record.mission,
        }).execute()
        return {"status": "saved"}
    except Exception as e:
        print(f"Error saving purchase: {e}")
        return {"status": "error", "message": str(e)}


@router.post("/memory/interaction")
def save_interaction(record: InteractionRecord):
    """Save a product interaction (selected/removed/added)."""
    try:
        supabase.table("user_interactions").insert({
            "user_id": record.user_id,
            "action": record.action,
            "product_name": record.product_name,
            "category": record.category,
            "brand": record.brand,
            "mission": record.mission,
        }).execute()
        return {"status": "saved"}
    except Exception as e:
        print(f"Error saving interaction: {e}")
        return {"status": "error", "message": str(e)}
