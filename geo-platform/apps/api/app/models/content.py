import enum
import uuid

from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class ContentStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class Content(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "contents"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(300))
    summary: Mapped[str | None] = mapped_column(String)
    body: Mapped[str | None] = mapped_column(String)
    faq: Mapped[list[dict] | None] = mapped_column(JSONB)
    schema_jsonld: Mapped[dict | None] = mapped_column(JSONB)
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"), default=ContentStatus.DRAFT
    )

    company: Mapped["Company"] = relationship(back_populates="contents")
    embeddings: Mapped[list["Embedding"]] = relationship(back_populates="content")
