import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class AIResult(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "ai_results"

    ai_task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("ai_tasks.id", ondelete="CASCADE"), unique=True
    )
    raw_answer: Mapped[str] = mapped_column(String)
    brand_mentioned: Mapped[bool] = mapped_column(Boolean, default=False)
    mention_position: Mapped[int | None] = mapped_column(Integer)
    citation_sources: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    competitor_brands_mentioned: Mapped[list[str] | None] = mapped_column(ARRAY(String))

    task: Mapped["AITask"] = relationship(back_populates="result")
