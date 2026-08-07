import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.ai_task import AIModel, TaskStatus


class AIResultOut(BaseModel):
    brand_mentioned: bool
    mention_position: int | None
    raw_answer: str
    citation_sources: list[str] | None
    competitor_brands_mentioned: list[str] | None

    class Config:
        from_attributes = True


class AITaskOut(BaseModel):
    id: uuid.UUID
    ai_model: AIModel
    status: TaskStatus
    created_at: datetime
    completed_at: datetime | None
    result: AIResultOut | None

    class Config:
        from_attributes = True
