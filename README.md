<h1 align="center">Azora - Amazon Goal Control</h1>

---

## Description

**Azora** is an AI-powered goal-based shopping assistant that integrates with Amazon to help users shop by *goal* instead of searching for products one by one.

Instead of asking "What product do you want?", Azora asks "What are you trying to achieve?" - then generates personalized product bundles using AI, adaptive questioning, and persistent customer memory.

Built for the **Amazon HackOn 2026** hackathon.

---

## Features

- **Goal-Based Shopping** - Users describe a goal (e.g., "Moving into a new apartment") and Azora generates complete product bundles (Essentials, Best Value, Premium)

- **AI Goal Understanding** - Groq LLM classifies user queries into goals or direct product searches with natural language understanding

- **Adaptive Questions** - AI generates contextual clarifying questions with relevant options specific to each product type

- **Smart Product Search** - Budget-aware, preference-filtered product search with relevance ranking

- **Image-Based Discovery** - Upload a photo and Groq Vision identifies products, returning matching items from the catalog

- **Bundle Customization** - Add/remove products from bundles with real-time price recalculation

- **Persistent Customer Memory** - System remembers past purchases, removed products, budget preferences, and brand preferences across sessions

- **Personalized Recommendations** - Returning users get bundles that exclude previously purchased items and prioritize preferred brands

- **Amazon Integration** - Seamless flow from Azora bundles to Amazon-style cart page with Azora icon for quick access

- **Authentication** - Amazon-themed login/signup using Supabase Auth with session persistence

- **Search History** - Recent searches displayed on homepage for quick re-access

*Two modes: Goal-based shopping (bundles) and Direct product search (individual items with adaptive filtering)*

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│  Supabase   │
│  (Next.js)  │◀────│  (FastAPI)   │◀────│ (PostgreSQL)│
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │   Groq AI    │
                    │ (LLM+Vision) │
                    └──────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, Tailwind CSS, Lucide Icons |
| Backend | FastAPI, Python, Uvicorn |
| Database | Supabase PostgreSQL |
| AI | Groq (Llama 3.1 for text, Llama 4 Scout for vision) |
| Auth | Supabase Authentication |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/amazon-hackon-2026-azora.git

# Navigate to project directory
cd amazon-hackon-2026-azora
```

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your keys
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_key
# GROQ_API_KEY=your_groq_api_key

# Start the backend server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the frontend dev server
npm run dev
```

---

## Project Structure

```
amazon-hackon-2026-azora/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── database/
│   │   └── supabase_client.py     # Supabase connection
│   ├── services/
│   │   ├── groq_service.py        # Groq LLM integration
│   │   └── memory_service.py      # User memory & personalization
│   ├── routes/
│   │   ├── understand.py          # POST /understand (goal classification)
│   │   ├── questions.py           # POST /questions (goal questions)
│   │   ├── adaptive_questions.py  # POST /adaptive-questions (AI-generated)
│   │   ├── bundles.py             # GET /bundles/{mission} (personalized)
│   │   ├── products.py            # GET /products/search
│   │   ├── smart_search.py        # POST /products/smart-search
│   │   ├── image_search.py        # POST /image-search (vision)
│   │   └── memory.py              # POST /memory/purchase & interaction
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.js                # Amazon homepage (root)
│   │   ├── login/page.js          # Amazon-themed login
│   │   ├── signup/page.js         # Amazon-themed signup
│   │   ├── amazon/page.js         # Amazon cart page
│   │   ├── azora/                 # Azora app (protected)
│   │   │   ├── page.js            # Azora homepage
│   │   │   ├── questions/         # Adaptive questions flow
│   │   │   ├── bundles/           # Bundle display & detail
│   │   │   ├── checkout/          # Checkout summary
│   │   │   └── redirect/          # Cart redirect animation
│   │   ├── components/            # Reusable UI components
│   │   ├── services/api.js        # API integration layer
│   │   └── lib/supabase.js        # Supabase client
│   └── package.json
└── README.md
```

---

## User Flow

```
Login/Signup - Amazon Homepage - Click Azora Icon
       |
Azora Homepage (Search by text, image, or goal cards)
       |
┌──────────────────────────────────────────┐
│  Goal Flow             │  Product Flow   │
│  "New Apartment"       │  "Running Shoes"│
│       |                │       |         │
│  Goal Questions        │  Adaptive Q's   │
│       |                │       |         │
│  Personalized Bundles  │  Filtered Results│
│  (Essentials/Best/     │  (Budget+Type)  │
│   Premium)             │       |         │
│       |                │  Add to Cart    │
│  Customize Bundle      │                 │
│       |                │                 │
│  Checkout              │                 │
└──────────┬─────────────┴─────────────────┘
           |
    Amazon Cart Page
```

---

## AI-Powered Features

| Feature | Model | Purpose |
|---------|-------|---------|
| Goal Classification | Llama 3.1 8B | Understand user intent from natural language |
| Adaptive Questions | Llama 3.1 8B | Generate contextual questions with options |
| Image Search | Llama 4 Scout 17B | Identify products from uploaded photos |
| Personalization | Memory Service | Exclude purchased items, prefer brands |

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `products` | 120+ products across 5 goals |
| `search_history` | User search queries & detected goals |
| `user_purchases` | Purchase history for personalization |
| `user_interactions` | Product add/remove tracking |
| `mission_templates` | Goal definitions |
| `category_priorities` | Category priority info |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/understand` | Classify user query into mission |
| POST | `/questions` | Get mission-specific questions |
| POST | `/adaptive-questions` | AI-generated product questions |
| GET | `/bundles/{mission}` | Personalized bundle generation |
| GET | `/products/search` | Search products by keyword |
| POST | `/products/smart-search` | Budget+preference filtered search |
| POST | `/image-search` | Vision-based product discovery |
| POST | `/memory/purchase` | Save purchase history |
| POST | `/memory/interaction` | Save product interactions |
| GET | `/products/mission/{name}` | All products for a mission |

---

## Team

Built by **Team Syntax Sirens** for Amazon HackOn 2026.

---

## License

This project is built for hackathon demonstration purposes.
