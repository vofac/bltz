import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Keyword(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "keywords"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE")
    )
    brand_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("brands.id", ondelete="SET NULL")
    )
    text: Mapped[str] = mapped_column(String(300))

    company: Mapped["Company"] = relationship(back_populates="keywords")
    ai_tasks: Mapped[list["AITask"]] = relationship(back_populates="keyword")
