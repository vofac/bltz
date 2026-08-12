import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class KeywordCreate(BaseModel):
    text: str = Field(min_length=1, max_length=300)
    brand_id: uuid.UUID | None = None


class KeywordOut(BaseModel):
    id: uuid.UUID
    text: str
    brand_id: uuid.UUID | None
    company_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
