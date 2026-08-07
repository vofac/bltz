import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Competitor(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "competitors"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(200))
    website: Mapped[str | None] = mapped_column(String(300))

    company: Mapped["Company"] = relationship(back_populates="competitors")
