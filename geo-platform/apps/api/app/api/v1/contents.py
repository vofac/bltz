import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.ai_task import AIModel
from app.models.company import Company
from app.models.content import Content, ContentStatus
from app.models.user import User
from app.schemas.content import ContentGenerateRequest, ContentListItem, ContentOut
from app.services.ai_providers.factory import get_ai_provider
from app.services.brands import get_or_create_default_brand
from app.services.content_generator.generator import generate_geo_content

router = APIRouter(prefix="/contents", tags=["contents"])


def _require_company(current_user: User) -> None:
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前账户未关联企业")


def _get_owned_content(db: Session, content_id: uuid.UUID, current_user: User) -> Content:
    content = db.get(Content, content_id)
    if not content or content.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="内容不存在")
    return content


@router.post("/generate", response_model=ContentOut, status_code=status.HTTP_201_CREATED)
def generate_content(
    payload: ContentGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Content:
    _require_company(current_user)
    company = db.get(Company, current_user.company_id)
    brand = get_or_create_default_brand(db, company)

    # 内容生成使用固定 provider（Mock 模式下与具体 AIModel 无关）；
    # Phase 2 可扩展为按用户偏好选择正文生成所用的模型。
    provider = get_ai_provider(AIModel.OPENAI)
    generated = generate_geo_content(company, brand, payload.keyword, provider)

    content = Content(
        company_id=company.id,
        title=generated.title,
        summary=generated.summary,
        body=generated.body,
        faq=generated.faq,
        schema_jsonld=generated.schema_jsonld,
        status=ContentStatus.DRAFT,
    )
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


@router.get("", response_model=list[ContentListItem])
def list_contents(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[Content]:
    _require_company(current_user)
    return (
        db.query(Content)
        .filter(Content.company_id == current_user.company_id)
        .order_by(Content.created_at.desc())
        .all()
    )


@router.get("/{content_id}", response_model=ContentOut)
def get_content(
    content_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Content:
    _require_company(current_user)
    return _get_owned_content(db, content_id, current_user)


@router.post("/{content_id}/publish", response_model=ContentOut)
def publish_content(
    content_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Content:
    _require_company(current_user)
    content = _get_owned_content(db, content_id, current_user)
    content.status = ContentStatus.PUBLISHED
    db.commit()
    db.refresh(content)
    return content


@router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_content(
    content_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    _require_company(current_user)
    content = _get_owned_content(db, content_id, current_user)
    db.delete(content)
    db.commit()
