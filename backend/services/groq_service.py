import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

VALID_MISSIONS = [
    "New Apartment",
    "Start Running",
    "Pasta Preparation",
    "College Starter",
    "Skincare",
]

SYSTEM_PROMPT = """You are a mission classifier for an e-commerce shopping assistant.

Given a user query, classify it into EXACTLY ONE of these missions:
- New Apartment
- Start Running
- Pasta Preparation
- College Starter
- Skincare
- Direct Product

Rules:
1. If the user is describing a GOAL or LIFE EVENT (e.g., "I just moved", "I want to get fit"), return the matching mission name.
2. If the user is asking for a SPECIFIC PRODUCT (e.g., "running shoes", "bedsheet", "laptop stand"), return "Direct Product".
3. Return ONLY the mission name. No explanation. No quotes. No extra text.

Examples:
- "I just rented my first flat" → New Apartment
- "I want to start jogging every morning" → Start Running
- "Need a beginner skincare routine" → Skincare
- "I need running shoes" → Direct Product
- "Buy me a pillow" → Direct Product
"""


def detect_mission(user_query: str) -> str:
    """Use Groq LLM to classify user query into a mission."""
    if not client:
        return None  # Will trigger fallback

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_query},
            ],
            temperature=0,
            max_tokens=20,
        )

        result = response.choices[0].message.content.strip()

        # Validate the response is a known mission or "Direct Product"
        if result in VALID_MISSIONS or result == "Direct Product":
            return result

        # Fuzzy match — in case LLM returns with slightly different casing
        for mission in VALID_MISSIONS:
            if mission.lower() == result.lower():
                return mission

        if "direct" in result.lower() or "product" in result.lower():
            return "Direct Product"

        # If response doesn't match any known mission, return None for fallback
        return None

    except Exception as e:
        print(f"Groq API error: {e}")
        return None  # Fallback to keyword matching
