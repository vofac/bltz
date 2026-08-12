import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Document(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "documents"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE")
    )
    filename: Mapped[str] = mapped_column(String(300))
    file_type: Mapped[str] = mapped_column(String(50))
    storage_path: Mapped[str] = mapped_column(String(500))
    extracted_text: Mapped[str | None] = mapped_column(String)

    company: Mapped["Company"] = relationship(back_populates="documents")
    embeddings: Mapped[list["Embedding"]] = relationship(back_populates="document")
