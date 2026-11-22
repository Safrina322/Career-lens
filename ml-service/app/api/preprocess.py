from fastapi import APIRouter

from app.nlp.preprocess import preprocess_text
from app.schemas.preprocess import (
    PreprocessRequest,
    PreprocessResponse,
)

router = APIRouter(tags=["preprocessing"])


@router.post("/preprocess", response_model=PreprocessResponse)
def preprocess(request: PreprocessRequest) -> PreprocessResponse:
    normalized_text, tokens = preprocess_text(request.text)

    return PreprocessResponse(
        original_length=len(request.text),
        normalized_text=normalized_text,
        tokens=tokens,
    )