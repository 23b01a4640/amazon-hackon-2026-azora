from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_service import client
import json

router = APIRouter()


class AdaptiveQuestionsRequest(BaseModel):
    query: str


SYSTEM_PROMPT = """You are a smart shopping assistant for an e-commerce platform in India.

Given a product search query, generate clarifying questions WITH answer options to help find the best product.

Rules:
1. Return 0 to 3 questions maximum.
2. Only ask questions that meaningfully help narrow down the product choice.
3. For very simple products (USB cable, pen, tape), return an empty array [].
4. Each question MUST have 2-4 short answer options relevant to that specific product.
5. Budget options should be realistic for the product category in Indian Rupees (₹).
6. Return ONLY a JSON array of objects with "question" and "options" keys.

Examples:
- Query: "running shoes"
  Response: [{"question": "What is your budget?", "options": ["Under ₹3000", "₹3000-₹5000", "₹5000+"]}, {"question": "What's your experience level?", "options": ["Beginner", "Intermediate", "Advanced"]}]

- Query: "face wash"
  Response: [{"question": "What is your skin type?", "options": ["Oily", "Dry", "Combination", "Sensitive"]}]

- Query: "gaming monitor"
  Response: [{"question": "What is your budget?", "options": ["Under ₹10000", "₹10000-₹20000", "₹20000+"]}, {"question": "Preferred screen size?", "options": ["24 inch", "27 inch", "32 inch+"]}]

- Query: "USB cable"
  Response: []

- Query: "books"
  Response: [{"question": "What type of books?", "options": ["Textbooks", "Notebooks", "Fiction", "Non-fiction"]}, {"question": "What is your budget?", "options": ["Under ₹300", "₹300-₹500", "₹500+"]}]

- Query: "pillow"
  Response: [{"question": "What type of pillow?", "options": ["Cotton", "Memory Foam", "Gel"]}, {"question": "What is your budget?", "options": ["Under ₹500", "₹500-₹1000", "₹1000+"]}]

Return ONLY the JSON array. No explanation. No markdown. No extra text."""


def generate_adaptive_questions(query: str) -> list:
    """Use Groq LLM to generate contextual questions with options for a product query."""
    if not client:
        return fallback_questions(query)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query},
            ],
            temperature=0,
            max_tokens=300,
        )

        result = response.choices[0].message.content.strip()

        # Handle markdown code blocks
        if result.startswith("```"):
            result = result.split("```")[1]
            if result.startswith("json"):
                result = result[4:]
            result = result.strip()

        questions = json.loads(result)

        if isinstance(questions, list):
            # Validate structure
            valid = []
            for q in questions[:3]:
                if isinstance(q, dict) and "question" in q and "options" in q:
                    valid.append(q)
                elif isinstance(q, str):
                    # Old format (just strings) - wrap with default options
                    valid.append({"question": q, "options": []})
            return valid

        return fallback_questions(query)

    except Exception as e:
        print(f"Groq adaptive questions error: {e}")
        return fallback_questions(query)


def fallback_questions(query: str) -> list:
    """Keyword-based fallback if Groq is unavailable."""
    q = query.lower()

    if "shoe" in q or "sneaker" in q:
        return [
            {"question": "What is your budget?", "options": ["Under ₹3000", "₹3000-₹5000", "₹5000+"]},
            {"question": "Experience level?", "options": ["Beginner", "Experienced"]}
        ]
    if "bottle" in q:
        return [
            {"question": "What type?", "options": ["Insulated", "Regular", "Sports"]}
        ]
    if "face wash" in q or "cleanser" in q or "moisturizer" in q:
        return [
            {"question": "What is your skin type?", "options": ["Oily", "Dry", "Combination", "Sensitive"]}
        ]
    if "monitor" in q or "screen" in q:
        return [
            {"question": "What is your budget?", "options": ["Under ₹10000", "₹10000-₹20000", "₹20000+"]},
            {"question": "Screen size?", "options": ["24 inch", "27 inch", "32 inch+"]}
        ]
    if "chair" in q:
        return [
            {"question": "What is your budget?", "options": ["Under ₹5000", "₹5000-₹10000", "₹10000+"]},
            {"question": "Primary use?", "options": ["Office Work", "Gaming", "Both"]}
        ]
    if "pillow" in q or "bedsheet" in q:
        return [
            {"question": "What is your budget?", "options": ["Under ₹500", "₹500-₹1000", "₹1000+"]}
        ]
    if "cable" in q or "charger" in q or "usb" in q:
        return []

    # Default
    return [
        {"question": "What is your budget?", "options": ["Under ₹1000", "₹1000-₹3000", "₹3000+"]}
    ]


@router.post("/adaptive-questions")
def adaptive_questions(request: AdaptiveQuestionsRequest):
    questions = generate_adaptive_questions(request.query)
    return {"questions": questions}
