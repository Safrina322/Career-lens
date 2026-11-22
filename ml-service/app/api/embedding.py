from fastapi import APIRouter

from app.schemas.embedding import (
    EmbeddingRequest,
    EmbeddingResponse,
    SimilarityRequest,
    SimilarityResponse,
)
from app.services.embedding_service import (
    MODEL_NAME,
    cosine_similarity,
    create_embeddings,
)

router = APIRouter(tags=["embeddings"])


@router.post("/embeddings", response_model=EmbeddingResponse)
def embeddings(request: EmbeddingRequest) -> EmbeddingResponse:
    vectors = create_embeddings(request.texts)
    return EmbeddingResponse(
        embeddings=vectors,
        dimensions=len(vectors[0]),
    )


@router.post("/similarity", response_model=SimilarityResponse)
def similarity(request: SimilarityRequest) -> SimilarityResponse:
    vectors = create_embeddings(
        [request.resume_text, request.job_text]
    )
    score = cosine_similarity(vectors[0], vectors[1])

    return SimilarityResponse(
        semantic_similarity=score,
        model=MODEL_NAME,
    )
