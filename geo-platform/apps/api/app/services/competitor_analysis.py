import uuid

from sqlalchemy.orm import Session

from app.models.ai_result import AIResult
from app.models.ai_task import AITask
from app.models.brand import Brand
from app.models.competitor import Competitor
from app.models.keyword import Keyword
from app.models.score import Score
from app.schemas.competitor import ComparisonEntry, ComparisonResult


def build_comparison(db: Session, company_id: uuid.UUID) -> ComparisonResult:
    """竞品对比：Phase 1 仅基于关键词监测中记录的『竞品在AI回答中被提及』的频率做对比，
    竞品自身的完整 GEO 评分需要抓取其官网/内容等信息，属于 Phase 2 后续范围。
    供 /competitors/comparison 与 /strategy/daily 复用。"""
    total_ai_tasks = (
        db.query(AITask)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company_id)
        .count()
    )

    entries: list[ComparisonEntry] = []

    brand = (
        db.query(Brand).filter(Brand.company_id == company_id).order_by(Brand.created_at).first()
    )
    own_mention_count = (
        db.query(AIResult)
        .join(AITask, AIResult.ai_task_id == AITask.id)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company_id, AIResult.brand_mentioned.is_(True))
        .count()
    )
    latest_score = (
        db.query(Score).filter(Score.brand_id == brand.id).order_by(Score.created_at.desc()).first()
        if brand
        else None
    )
    own_mention_rate = (own_mention_count / total_ai_tasks) if total_ai_tasks else None
    entries.append(
        ComparisonEntry(
            name=brand.name if brand else "我的品牌",
            is_own_brand=True,
            geo_score=latest_score.total_score if latest_score else None,
            mention_count=own_mention_count,
            mention_rate=own_mention_rate,
        )
    )

    competitors = (
        db.query(Competitor)
        .filter(Competitor.company_id == company_id)
        .order_by(Competitor.created_at)
        .all()
    )
    for competitor in competitors:
        mention_count = (
            db.query(AIResult)
            .join(AITask, AIResult.ai_task_id == AITask.id)
            .join(Keyword, AITask.keyword_id == Keyword.id)
            .filter(Keyword.company_id == company_id)
            .filter(AIResult.competitor_brands_mentioned.any(competitor.name))
            .count()
        )
        mention_rate = (mention_count / total_ai_tasks) if total_ai_tasks else None
        entries.append(
            ComparisonEntry(
                name=competitor.name,
                is_own_brand=False,
                geo_score=None,
                mention_count=mention_count,
                mention_rate=mention_rate,
            )
        )

    opportunities: list[str] = []
    if own_mention_rate is not None:
        for entry in entries:
            if not entry.is_own_brand and entry.mention_rate and entry.mention_rate > own_mention_rate:
                opportunities.append(
                    f"竞品「{entry.name}」在 AI 回答中的出现频率高于你，可参考其内容策略"
                )
    if total_ai_tasks == 0:
        opportunities.append("尚未运行关键词监测，先添加关键词并监测以获得对比数据")

    return ComparisonResult(
        total_ai_tasks=total_ai_tasks, entries=entries, opportunities=opportunities
    )
