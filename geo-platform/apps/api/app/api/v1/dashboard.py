from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.ai_result import AIResult
from app.models.ai_task import AITask
from app.models.brand import Brand
from app.models.keyword import Keyword
from app.models.score import Score
from app.models.user import User
from app.schemas.dashboard import DashboardSummary, ModelMentionStat, ScorePoint

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> DashboardSummary:
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前账户未关联企业")

    company_id = current_user.company_id

    brand = (
        db.query(Brand).filter(Brand.company_id == company_id).order_by(Brand.created_at).first()
    )

    score_history: list[ScorePoint] = []
    latest_score = previous_score = None
    content_coverage_pct = None
    if brand:
        scores = (
            db.query(Score)
            .filter(Score.brand_id == brand.id)
            .order_by(Score.created_at.asc())
            .all()
        )
        score_history = [
            ScorePoint(created_at=s.created_at, total_score=s.total_score) for s in scores
        ]
        if scores:
            latest_score = scores[-1].total_score
            content_coverage_pct = round(scores[-1].content_score / 30 * 100, 1)
        if len(scores) >= 2:
            previous_score = scores[-2].total_score

    score_change_pct = None
    if latest_score is not None and previous_score:
        score_change_pct = round((latest_score - previous_score) / previous_score * 100, 1)

    keywords_count = db.query(Keyword).filter(Keyword.company_id == company_id).count()

    total_ai_tasks = (
        db.query(AITask)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company_id)
        .count()
    )
    mentioned_tasks = (
        db.query(AIResult)
        .join(AITask, AIResult.ai_task_id == AITask.id)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company_id, AIResult.brand_mentioned.is_(True))
        .count()
    )
    mention_rate = (mentioned_tasks / total_ai_tasks) if total_ai_tasks else None

    citation_count = (
        db.query(func.coalesce(func.sum(func.cardinality(AIResult.citation_sources)), 0))
        .join(AITask, AIResult.ai_task_id == AITask.id)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company_id)
        .scalar()
    )

    average_mention_position = (
        db.query(func.avg(AIResult.mention_position))
        .join(AITask, AIResult.ai_task_id == AITask.id)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company_id, AIResult.brand_mentioned.is_(True))
        .scalar()
    )

    rows = (
        db.query(
            AITask.ai_model,
            func.count(AITask.id),
            func.sum(case((AIResult.brand_mentioned.is_(True), 1), else_=0)),
        )
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .outerjoin(AIResult, AIResult.ai_task_id == AITask.id)
        .filter(Keyword.company_id == company_id)
        .group_by(AITask.ai_model)
        .all()
    )
    model_stats = [
        ModelMentionStat(ai_model=model, total_tasks=total, mentioned_count=mentioned or 0)
        for model, total, mentioned in rows
    ]

    return DashboardSummary(
        latest_score=latest_score,
        previous_score=previous_score,
        score_change_pct=score_change_pct,
        score_history=score_history,
        keywords_count=keywords_count,
        total_ai_tasks=total_ai_tasks,
        mentioned_tasks=mentioned_tasks,
        mention_rate=mention_rate,
        citation_count=citation_count,
        average_mention_position=(
            round(float(average_mention_position), 1) if average_mention_position else None
        ),
        content_coverage_pct=content_coverage_pct,
        model_stats=model_stats,
    )
