import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.content import ContentStatus


class ContentGenerateRequest(BaseModel):
    keyword: str = Field(min_length=1, max_length=300)


class ContentListItem(BaseModel):
    id: uuid.UUID
    title: str
    status: ContentStatus
    created_at: datetime

    class Config:
        from_attributes = True


class ContentOut(BaseModel):
    id: uuid.UUID
    title: str
    summary: str | None
    body: str | None
    faq: list[dict] | None
    schema_jsonld: dict | None
    status: ContentStatus
    created_at: datetime

    class Config:
        from_attributes = True
