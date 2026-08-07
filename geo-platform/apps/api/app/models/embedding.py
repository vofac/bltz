import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Embedding(UUIDPKMixin, TimestampMixin, Base):
    """指向 Qdrant 中实际向量的元数据行；向量本体存储在 VectorDB，此表仅做业务关联与检索索引。"""

    __tablename__ = "embeddings"

    document_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE")
    )
    content_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("contents.id", ondelete="CASCADE")
    )
    chunk_text: Mapped[str] = mapped_column(String)
    vector_point_id: Mapped[str] = mapped_column(String(100), unique=True)

    document: Mapped["Document"] = relationship(back_populates="embeddings")
    content: Mapped["Content"] = relationship(back_populates="embeddings")
