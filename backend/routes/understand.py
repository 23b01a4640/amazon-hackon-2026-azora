from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class UnderstandRequest(BaseModel):
    query: str

@router.post("/understand")
def understand_mission(request: UnderstandRequest):

    query = request.query.lower()

    if "apartment" in query:
        return {"mission": "New Apartment"}

    if "running" in query:
        return {"mission": "Start Running"}

    if "pasta" in query:
        return {"mission": "Pasta Preparation"}

    if "college" in query:
        return {"mission": "College Starter"}

    if "skin" in query:
        return {"mission": "Skincare"}

    return {"mission": "Direct Product", "search_query": request.query}