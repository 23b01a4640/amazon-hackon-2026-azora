from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AdaptiveQuestionsRequest(BaseModel):
    query: str

@router.post("/adaptive-questions")
def adaptive_questions(request: AdaptiveQuestionsRequest):
    query = request.query

    query = query.lower()

    if "shoe" in query or "running" in query:
        return {
            "questions": [
                "What is your budget?",
                "Are you a beginner or experienced runner?"
            ]
        }

    if "water bottle" in query or "bottle" in query:
        return {
            "questions": [
                "Do you want insulated or regular?"
            ]
        }

    if "face wash" in query or "cleanser" in query:
        return {
            "questions": [
                "What is your skin type?"
            ]
        }

    if "monitor" in query:
        return {
            "questions": [
                "What screen size are you looking for?"
            ]
        }

    if "chair" in query:
        return {
            "questions": [
                "Do you need it for office work or gaming?"
            ]
        }

    return {
        "questions": []
    }