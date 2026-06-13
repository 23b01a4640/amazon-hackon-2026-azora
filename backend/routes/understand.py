from fastapi import APIRouter

router = APIRouter()

@router.post("/understand")
def understand_mission(query: str):

    query = query.lower()

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

    return {"mission": "Unknown"}