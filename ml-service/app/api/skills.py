from fastapi import APIRouter

from app.nlp.skills import extract_skills
from app.schemas.skills import SkillsRequest, SkillsResponse

router = APIRouter(tags=["skills"])


@router.post("/skills/extract", response_model=SkillsResponse)
def extract(request: SkillsRequest) -> SkillsResponse:
    return SkillsResponse(skills=extract_skills(request.text))
