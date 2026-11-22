from fastapi import FastAPI
from app.api.preprocess import router as preprocess_router
from app.api.skills import router as skills_router
from app.api.embedding import router as embedding_router

from app.api.health import router as health_router

app = FastAPI(
    title="CareerLens AI ML Service",
    version="0.1.0",
)

app.include_router(health_router)
app.include_router(preprocess_router)
app.include_router(skills_router)
app.include_router(embedding_router)
