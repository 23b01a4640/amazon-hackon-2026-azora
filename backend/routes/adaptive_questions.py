from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AdaptiveQuestionsRequest(BaseModel):
    query: str


@router.post("/adaptive-questions")
def adaptive_questions(request: AdaptiveQuestionsRequest):
    query = request.query.lower()

    # Footwear
    if "shoe" in query or "sneaker" in query or "sandal" in query:
        return {
            "questions": [
                "What is your budget?",
                "Are you a beginner or experienced runner?"
            ]
        }

    # Bottles
    if "bottle" in query:
        return {
            "questions": [
                "Do you want insulated or regular?"
            ]
        }

    # Skincare
    if "face wash" in query or "cleanser" in query or "moisturizer" in query or "sunscreen" in query or "serum" in query:
        return {
            "questions": [
                "What is your skin type?"
            ]
        }

    # Electronics — monitors
    if "monitor" in query or "screen" in query or "display" in query:
        return {
            "questions": [
                "What screen size are you looking for?"
            ]
        }

    # Furniture — chairs
    if "chair" in query:
        return {
            "questions": [
                "Do you need it for office work or gaming?"
            ]
        }

    # Bedding
    if "bedsheet" in query or "bed sheet" in query or "pillow" in query or "mattress" in query:
        return {
            "questions": [
                "What is your budget?"
            ]
        }

    # Lighting
    if "lamp" in query or "light" in query:
        return {
            "questions": [
                "What is your budget?"
            ]
        }

    # Bags
    if "bag" in query or "backpack" in query:
        return {
            "questions": [
                "What is your budget?"
            ]
        }

    # Books / Stationery
    if "book" in query or "notebook" in query or "stationery" in query:
        return {
            "questions": [
                "What is your budget?"
            ]
        }

    # Cooking
    if "cooker" in query or "pan" in query or "pot" in query or "cookware" in query:
        return {
            "questions": [
                "Are you cooking for yourself or family?"
            ]
        }

    # Cables / Chargers — no questions needed
    if "cable" in query or "charger" in query or "usb" in query:
        return {
            "questions": []
        }

    # Default — always ask budget for any unrecognized product
    return {
        "questions": [
            "What is your budget?"
        ]
    }
