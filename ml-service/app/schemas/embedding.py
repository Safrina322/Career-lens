from pydantic import BaseModel, Field


class EmbeddingRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=100)


class EmbeddingResponse(BaseModel):
    embeddings: list[list[float]]
    dimensions: int


class SimilarityRequest(BaseModel):
    resume_text: str = Field(..., min_length=1, max_length=50000)
    job_text: str = Field(..., min_length=1, max_length=50000)


class SimilarityResponse(BaseModel):
    semantic_similarity: float
    model: str
