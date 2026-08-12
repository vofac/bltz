import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Report(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "reports"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(300))
    report_type: Mapped[str] = mapped_column(String(50))
    content: Mapped[dict] = mapped_column(JSONB)

    company: Mapped["Company"] = relationship(back_populates="reports")
