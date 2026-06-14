from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.products import router as products_router
from routes.bundles import router as bundles_router
from routes.understand import router as understand_router
from routes.questions import router as questions_router
from routes.adaptive_questions import router as adaptive_questions_router
from routes.smart_search import router as smart_search_router
from routes.image_search import router as image_search_router
from routes.memory import router as memory_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(bundles_router)
app.include_router(understand_router)
app.include_router(questions_router)
app.include_router(adaptive_questions_router)
app.include_router(smart_search_router)
app.include_router(image_search_router)
app.include_router(memory_router)

@app.get("/")
def root():
    return {"message": "Amazon Mission Control"}

@app.get("/health")
def health():
    return {"status": "healthy"}