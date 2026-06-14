from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class UnderstandRequest(BaseModel):
    query: str

# Mission keywords — only match if the query is clearly about the mission (goal-oriented),
# not about a specific product.
MISSION_PATTERNS = {
    "New Apartment": ["new apartment", "moving into", "apartment setup", "shifting to new"],
    "Start Running": ["start running", "begin running", "running routine", "jogging routine"],
    "Pasta Preparation": ["pasta preparation", "cook pasta", "making pasta", "prepare pasta"],
    "College Starter": ["college starter", "starting college", "college essentials", "going to college"],
    "Skincare": ["skincare routine", "skin care routine", "skincare regimen", "skin routine"],
}

# Product keywords — if ANY of these appear, treat as direct product search
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


@router.post("/understand")
def understand_mission(request: UnderstandRequest):
    query = request.query.lower().strip()

    # First check — if the query contains a specific product keyword,
    # it's a direct product search regardless of mission words.
    for keyword in PRODUCT_KEYWORDS:
        if keyword in query:
            return {"mission": "Direct Product", "search_query": request.query}

    # Second check — match against mission patterns (phrase-level)
    for mission, patterns in MISSION_PATTERNS.items():
        for pattern in patterns:
            if pattern in query:
                return {"mission": mission}

    # Third check — loose single-word match for missions (fallback)
    if "apartment" in query:
        return {"mission": "New Apartment"}
    if "college" in query:
        return {"mission": "College Starter"}
    if "pasta" in query:
        return {"mission": "Pasta Preparation"}
    if "skincare" in query or "skin care" in query:
        return {"mission": "Skincare"}

    # Default — treat as direct product search
    return {"mission": "Direct Product", "search_query": request.query}
