from pydantic import BaseModel, Field


class PreprocessRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000)


class PreprocessResponse(BaseModel):
    original_length: int
    normalized_text: str
    tokens: list[str]