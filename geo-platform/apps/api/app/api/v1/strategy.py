from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.brand import Brand
from app.models.competitor import Competitor
from app.models.content import Content, ContentStatus
from app.models.keyword import Keyword
from app.models.score import Score
from app.models.user import User
from app.schemas.strategy import DailyStrategy, StrategyTask
from app.services.competitor_analysis import build_comparison

router = APIRouter(prefix="/strategy", tags=["strategy"])

MAX_TASKS = 8
MAX_SCORE_RECOMMENDATIONS = 4


@router.get("/daily", response_model=DailyStrategy)
def get_daily_strategy(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> DailyStrategy:
    """基于最新 GEO 评分建议、内容发布情况与竞品对比机会点，实时拼装『今日任务』。
    Phase 1/2 不做每日快照持久化：只要底层数据（评分/内容/竞品）不变，同一天内多次
    请求结果一致；数据更新后（如重新计算评分）任务列表会随之刷新，这比缓存一份
    过时快照更贴合『每日优化建议』的实际使用场景。"""
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前账户未关联企业")
    company_id = current_user.company_id

    tasks: list[StrategyTask] = []

    keywords_count = db.query(Keyword).filter(Keyword.company_id == company_id).count()
    if keywords_count == 0:
        tasks.append(
            StrategyTask(category="监测", description="添加第一个关键词并运行 AI 搜索监测")
        )

    brand = (
        db.query(Brand).filter(Brand.company_id == company_id).order_by(Brand.created_at).first()
    )
    latest_score = (
        db.query(Score).filter(Score.brand_id == brand.id).order_by(Score.created_at.desc()).first()
        if brand
        else None
    )
    if latest_score is None:
        tasks.append(StrategyTask(category="评分", description="前往 GEO 评分页面计算首次评分"))
    else:
        for recommendation in (latest_score.recommendations or [])[:MAX_SCORE_RECOMMENDATIONS]:
            tasks.append(StrategyTask(category="评分优化", description=recommendation))

    published_count = (
        db.query(Content)
        .filter(Content.company_id == company_id, Content.status == ContentStatus.PUBLISHED)
        .count()
    )
    if published_count == 0:
        tasks.append(
            StrategyTask(category="内容", description="使用内容优化助手生成并发布至少一篇 GEO 内容")
        )

    competitors_count = (
        db.query(Competitor).filter(Competitor.company_id == company_id).count()
    )
    if competitors_count > 0:
        comparison = build_comparison(db, company_id)
        for opportunity in comparison.opportunities:
            tasks.append(StrategyTask(category="竞品", description=opportunity))

    if not tasks:
        tasks.append(
            StrategyTask(category="保持", description="各项指标运行良好，继续保持内容更新节奏")
        )

    return DailyStrategy(date=date.today(), tasks=tasks[:MAX_TASKS])
