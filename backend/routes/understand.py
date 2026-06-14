from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_service import detect_mission

router = APIRouter()

class UnderstandRequest(BaseModel):
    query: str

# Fallback: Product keywords — if ANY of these appear, treat as direct product search
PRODUCT_KEYWORDS = [
    "shoe", "shoes", "bottle", "lamp", "pillow", "bedsheet", "bed sheet",
    "cable", "charger", "phone", "laptop", "earphone", "headphone",
    "watch", "bag", "backpack", "pen", "notebook", "book", "chair", "desk",
    "monitor", "keyboard", "mouse", "face wash", "cleanser", "moisturizer",
    "sunscreen", "serum", "cream", "mat", "yoga", "dumbbell", "band",
    "cooker", "pan", "pot", "spatula", "knife", "plate", "cup", "mug",
    "towel", "curtain", "rug", "mirror", "shelf", "organizer", "storage",
    "earbuds", "speaker", "stand", "power bank", "calculator", "umbrella",
    "jacket", "t-shirt", "jogger", "track pant",
]


def fallback_classify(query: str, original_query: str) -> dict:
    """Keyword-based fallback if Groq is unavailable or fails."""
    query_lower = query.lower().strip()

    for keyword in PRODUCT_KEYWORDS:
        if keyword in query_lower:
            return {"mission": "Direct Product", "search_query": original_query}

    if "apartment" in query_lower or "flat" in query_lower or "moving" in query_lower:
        return {"mission": "New Apartment"}
    if "running" in query_lower or "jogging" in query_lower or "jog" in query_lower:
        return {"mission": "Start Running"}
    if "pasta" in query_lower or "cook" in query_lower:
        return {"mission": "Pasta Preparation"}
    if "college" in query_lower or "university" in query_lower:
        return {"mission": "College Starter"}
    if "skin" in query_lower:
        return {"mission": "Skincare"}

    return {"mission": "Direct Product", "search_query": original_query}


@router.post("/understand")
def understand_mission(request: UnderstandRequest):
    query = request.query

    # Try Groq LLM classification
    mission = detect_mission(query)

    if mission:
        if mission == "Direct Product":
            return {"mission": "Direct Product", "search_query": query}
        return {"mission": mission}

    # Fallback to keyword matching if Groq fails
    return fallback_classify(query, query)
