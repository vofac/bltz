import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class CompetitorCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    website: str | None = None


class CompetitorOut(BaseModel):
    id: uuid.UUID
    name: str
    website: str | None
    company_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class ComparisonEntry(BaseModel):
    name: str
    is_own_brand: bool
    geo_score: int | None
    mention_count: int
    mention_rate: float | None


class ComparisonResult(BaseModel):
    total_ai_tasks: int
    entries: list[ComparisonEntry]
    opportunities: list[str]
