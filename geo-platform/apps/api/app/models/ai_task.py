import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class AIModel(str, enum.Enum):
    OPENAI = "openai"
    CLAUDE = "claude"
    GEMINI = "gemini"
    PERPLEXITY = "perplexity"
    GOOGLE_AIO = "google_aio"


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class AITask(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "ai_tasks"

    keyword_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("keywords.id", ondelete="CASCADE")
    )
    ai_model: Mapped[AIModel] = mapped_column(Enum(AIModel, name="ai_model"))
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status"), default=TaskStatus.PENDING
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    keyword: Mapped["Keyword"] = relationship(back_populates="ai_tasks")
    result: Mapped["AIResult"] = relationship(
        back_populates="task", uselist=False, cascade="all, delete-orphan"
    )
