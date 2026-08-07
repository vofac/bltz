import uuid

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Score(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "scores"

    brand_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("brands.id", ondelete="CASCADE")
    )

    # 100 分制：品牌权威30 + 内容覆盖30 + AI理解度20 + 用户信任20
    authority_score: Mapped[int] = mapped_column(Integer)
    content_score: Mapped[int] = mapped_column(Integer)
    ai_understanding_score: Mapped[int] = mapped_column(Integer)
    trust_score: Mapped[int] = mapped_column(Integer)
    total_score: Mapped[int] = mapped_column(Integer)

    strengths: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    recommendations: Mapped[list[str] | None] = mapped_column(ARRAY(String))

    brand: Mapped["Brand"] = relationship(back_populates="scores")
