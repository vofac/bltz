import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class DocumentListItem(BaseModel):
    id: uuid.UUID
    filename: str
    file_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentOut(BaseModel):
    id: uuid.UUID
    filename: str
    file_type: str
    extracted_text: str | None
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)
    limit: int = Field(default=5, ge=1, le=20)


class SearchResultItem(BaseModel):
    document_id: uuid.UUID
    filename: str
    chunk_text: str
    score: float


class SearchResponse(BaseModel):
    results: list[SearchResultItem]
