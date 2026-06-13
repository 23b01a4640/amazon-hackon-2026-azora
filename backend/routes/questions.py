from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class QuestionsRequest(BaseModel):
    mission: str

@router.post("/questions")
def get_questions(request: QuestionsRequest):
    mission = request.mission

    mission = mission.lower()

    if mission == "new apartment":
        return {
            "questions": [
                "What is your budget?",
                "How many people will live in the apartment?",
                "Do you already have furniture?"
            ]
        }

    if mission == "start running":
        return {
            "questions": [
                "What is your budget?",
                "Are you a beginner or experienced runner?",
                "Do you run indoors or outdoors?"
            ]
        }

    if mission == "pasta preparation":
        return {
            "questions": [
                "What is your budget?",
                "Are you cooking for yourself or family?",
                "Do you already have basic cookware?"
            ]
        }

    if mission == "college starter":
        return {
            "questions": [
                "What is your budget?",
                "Do you already own a laptop?",
                "Are you staying in a hostel?"
            ]
        }

    if mission == "skincare":
        return {
            "questions": [
                "What is your budget?",
                "What is your skin type?",
                "Are you looking for a basic or complete routine?"
            ]
        }

    return {"questions": []}