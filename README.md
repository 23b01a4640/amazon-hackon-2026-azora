<h1 align="center">Azora - Amazon Goal Control</h1>

---

## Live Link

[https://amazon-hackon-2026-azora.vercel.app/](https://amazon-hackon-2026-azora.vercel.app/)

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

- **Smart Product Search** - Budget-aware, preference-filtered product search with AI-powered keyword matching and relevance ranking

- **Intent-Aware Visual Product Search** - Upload a photo with a text query and Groq Vision identifies the product, classifies user intent (similar, complementary, or bundle), and retrieves results accordingly

- **Multi-Select Cart** - Select multiple products from search results with Select All, individual checkboxes, and Add Selected to Cart with real-time total

- **Bundle Customization** - Add/remove products from bundles with real-time price recalculation

- **Smart Repurchase-Aware Recommendations** - Distinguishes between repurchasable products (skincare, groceries) and non-repurchasable products (electronics, furniture) - only excludes non-repurchasable items from future recommendations

- **Persistent Customer Memory** - System remembers past purchases, removed products, budget preferences, and brand preferences across sessions

- **Personalized Recommendations** - Returning users get bundles that respect repurchase logic and prioritize preferred brands

- **Amazon Integration** - Seamless flow from Azora bundles to Amazon-style cart page with functional checkboxes, quantity controls, and Azora icon for quick access

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
git clone https://github.com/23b01a4640/amazon-hackon-2026-azora.git

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
│   │   └── memory_service.py      # User memory, personalization & repurchase logic
│   ├── routes/
│   │   ├── understand.py          # POST /understand (goal classification)
│   │   ├── questions.py           # POST /questions (goal questions)
│   │   ├── adaptive_questions.py  # POST /adaptive-questions (AI-generated)
│   │   ├── bundles.py             # GET /bundles/{mission} (personalized)
│   │   ├── products.py            # GET /products/search
│   │   ├── smart_search.py        # POST /products/smart-search (AI-filtered)
│   │   ├── image_search.py        # POST /image-search (intent-aware vision)
│   │   └── memory.py              # POST /memory/purchase & interaction
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.js                # Amazon homepage (root)
│   │   ├── login/page.js          # Amazon-themed login
│   │   ├── signup/page.js         # Amazon-themed signup
│   │   ├── amazon/page.js         # Amazon cart page (functional checkboxes)
│   │   ├── azora/                 # Azora app (protected)
│   │   │   ├── page.js            # Azora homepage
│   │   │   ├── questions/         # Adaptive questions flow
│   │   │   ├── bundles/           # Bundle display, search results & multi-select
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
│       |                │  Select & Add   │
│  Customize Bundle      │  to Cart        │
│       |                │                 │
│  Checkout              │                 │
└──────────┬─────────────┴─────────────────┘
           |
    Amazon Cart Page (Select items - Proceed to Buy)
           |
    Only checked items saved as purchases
```

---

## AI-Powered Features

| Feature | Model | Purpose |
|---------|-------|---------|
| Goal Classification | Llama 3.1 8B | Understand user intent from natural language |
| Adaptive Questions | Llama 3.1 8B | Generate contextual questions with options |
| Smart Product Filtering | Llama 3.1 8B | AI-powered filtering when keyword matching fails |
| Intent-Aware Image Search | Llama 4 Scout 17B | Identify products and classify intent (similar/complementary/bundle) |
| Personalization | Memory Service | Repurchase-aware filtering, brand preference |

---

## Smart Repurchase-Aware Recommendations

The system distinguishes between product types for intelligent filtering:

| Category Type | Examples | Behavior After Purchase |
|---------------|----------|------------------------|
| Repurchasable | Sunscreen, Moisturizer, Protein Powder, Shampoo | Still appears in future recommendations |
| Non-Repurchasable | Mouse, Office Chair, Monitor, Backpack, Laptop Stand | Excluded from future recommendations |

Repurchasable categories: Skincare, Fitness Nutrition, Personal Care, Grocery

Non-Repurchasable categories: Clothing, Electronics, Furniture, Backpack, Monitor, Study Essentials, Computer Accessories, Laptop Accessories, Storage, Home Decor

---

## Intent-Aware Visual Product Search

Upload an image with an optional text query to get intent-specific results:

| Intent | Example Query | Behavior |
|--------|--------------|----------|
| Similar | "Find similar shirts" | Returns products from the same category |
| Complementary | "Suggest pants for this shirt" | Returns products from the requested complementary category |
| Bundle | "Build a skincare routine around this" | Generates a bundle of complementary products |
| No query | (image only) | Default similar product search |

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `products` | 120+ products |
| `search_history` | User search queries & detected goals |
| `user_purchases` | Purchase history with category for repurchase logic |
| `user_interactions` | Product add/remove tracking |
| `mission_templates` | Goal definitions |
| `category_priorities` | Category priority info |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/understand` | Classify user query into mission or direct product |
| POST | `/questions` | Get mission-specific questions |
| POST | `/adaptive-questions` | AI-generated product questions |
| GET | `/bundles/{mission}` | Personalized bundle generation (repurchase-aware) |
| GET | `/products/search` | Search products by keyword |
| POST | `/products/smart-search` | AI-filtered search with budget, preferences & repurchase awareness |
| POST | `/image-search` | Intent-aware vision-based product discovery |
| POST | `/memory/purchase` | Save purchase history |
| POST | `/memory/interaction` | Save product interactions |
| GET | `/products/mission/{name}` | All products for a mission |

---

## Team

Built by **Team Syntax Sirens** for Amazon HackOn 2026.

---

## License

This project is built for hackathon demonstration purposes.
