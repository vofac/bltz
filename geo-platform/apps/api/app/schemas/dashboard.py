from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.ai_task import AIModel


class ScorePoint(BaseModel):
    created_at: datetime
    total_score: int


class ModelMentionStat(BaseModel):
    ai_model: AIModel
    total_tasks: int
    mentioned_count: int


class DashboardSummary(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    latest_score: int | None
    previous_score: int | None
    score_change_pct: float | None
    score_history: list[ScorePoint]

    keywords_count: int
    total_ai_tasks: int
    mentioned_tasks: int
    mention_rate: float | None
    citation_count: int
    average_mention_position: float | None
    content_coverage_pct: float | None

    model_stats: list[ModelMentionStat]
