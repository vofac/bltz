import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.ai_result import AIResult
from app.models.ai_task import AIModel, AITask, TaskStatus
from app.models.brand import Brand
from app.models.company import Company
from app.models.keyword import Keyword
from app.models.user import User
from app.schemas.ai_task import AITaskOut
from app.schemas.keyword import KeywordCreate, KeywordOut
from app.services.ai_providers.factory import get_ai_provider
from app.services.brands import get_or_create_default_brand

router = APIRouter(prefix="/keywords", tags=["keywords"])


def _get_owned_keyword(db: Session, keyword_id: uuid.UUID, current_user: User) -> Keyword:
    keyword = db.get(Keyword, keyword_id)
    if not keyword or keyword.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="关键词不存在")
    return keyword


@router.post("", response_model=KeywordOut, status_code=status.HTTP_201_CREATED)
def create_keyword(
    payload: KeywordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Keyword:
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前账户未关联企业")

    if payload.brand_id:
        brand = db.get(Brand, payload.brand_id)
        if not brand or brand.company_id != current_user.company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="品牌不存在")

    keyword = Keyword(
        company_id=current_user.company_id, brand_id=payload.brand_id, text=payload.text
    )
    db.add(keyword)
    db.commit()
    db.refresh(keyword)
    return keyword


@router.get("", response_model=list[KeywordOut])
def list_keywords(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[Keyword]:
    return (
        db.query(Keyword)
        .filter(Keyword.company_id == current_user.company_id)
        .order_by(Keyword.created_at.desc())
        .all()
    )


@router.post("/{keyword_id}/monitor", response_model=list[AITaskOut])
def monitor_keyword(
    keyword_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AITask]:
    """对该关键词并行调用 5 类生成式引擎（Phase 1 为 MockAIProvider），
    落库 AITask + AIResult。Mock 模式下调用近乎即时，故同步执行；
    Phase 2 接入真实厂商 API 后，应将 provider.analyze 调用改为经由
    Celery worker 异步执行（infra 已在 app/workers 中就绪）。"""
    keyword = _get_owned_keyword(db, keyword_id, current_user)
    company = db.get(Company, current_user.company_id)

    brand = (
        db.get(Brand, keyword.brand_id)
        if keyword.brand_id
        else get_or_create_default_brand(db, company)
    )

    tasks: list[AITask] = []
    for model in AIModel:
        task = AITask(keyword_id=keyword.id, ai_model=model, status=TaskStatus.RUNNING)
        db.add(task)
        db.flush()

        provider = get_ai_provider(model)
        outcome = provider.analyze(keyword.text, brand.name, brand.aliases or [])

        db.add(
            AIResult(
                ai_task_id=task.id,
                raw_answer=outcome.raw_answer,
                brand_mentioned=outcome.brand_mentioned,
                mention_position=outcome.mention_position,
                citation_sources=outcome.citation_sources,
                competitor_brands_mentioned=outcome.competitor_brands_mentioned,
            )
        )
        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.now(timezone.utc)
        tasks.append(task)

    db.commit()
    for task in tasks:
        db.refresh(task)
    return tasks


@router.get("/{keyword_id}/tasks", response_model=list[AITaskOut])
def list_keyword_tasks(
    keyword_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AITask]:
    keyword = _get_owned_keyword(db, keyword_id, current_user)
    return (
        db.query(AITask)
        .filter(AITask.keyword_id == keyword.id)
        .order_by(AITask.created_at.desc())
        .all()
    )
