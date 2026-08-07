import uuid
from datetime import datetime

from pydantic import BaseModel


class ScoreOut(BaseModel):
    id: uuid.UUID
    brand_id: uuid.UUID
    authority_score: int
    content_score: int
    ai_understanding_score: int
    trust_score: int
    total_score: int
    strengths: list[str] | None
    recommendations: list[str] | None
    created_at: datetime

    class Config:
        from_attributes = True
