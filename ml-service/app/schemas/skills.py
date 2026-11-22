from pydantic import BaseModel, Field


class SkillsRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000)


class SkillsResponse(BaseModel):
    skills: list[str]
    method: str = "rule_based"
