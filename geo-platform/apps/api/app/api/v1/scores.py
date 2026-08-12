from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.brand import Brand
from app.models.company import Company
from app.models.score import Score
from app.models.user import User
from app.schemas.score import ScoreOut
from app.services.brands import get_or_create_default_brand
from app.services.geo_scoring.scorer import compute_score

router = APIRouter(prefix="/scores", tags=["scores"])


def _require_company(current_user: User) -> None:
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前账户未关联企业")


@router.post("/compute", response_model=ScoreOut, status_code=status.HTTP_201_CREATED)
def compute_and_save_score(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> Score:
    _require_company(current_user)
    company = db.get(Company, current_user.company_id)
    brand = get_or_create_default_brand(db, company)

    breakdown = compute_score(db, company, brand)

    score = Score(
        brand_id=brand.id,
        authority_score=breakdown.authority_score,
        content_score=breakdown.content_score,
        ai_understanding_score=breakdown.ai_understanding_score,
        trust_score=breakdown.trust_score,
        total_score=breakdown.total_score,
        strengths=breakdown.strengths,
        recommendations=breakdown.recommendations,
    )
    db.add(score)
    db.commit()
    db.refresh(score)
    return score


@router.get("/latest", response_model=ScoreOut)
def get_latest_score(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> Score:
    _require_company(current_user)
    brand = (
        db.query(Brand)
        .filter(Brand.company_id == current_user.company_id)
        .order_by(Brand.created_at)
        .first()
    )
    score = (
        db.query(Score)
        .filter(Score.brand_id == brand.id)
        .order_by(Score.created_at.desc())
        .first()
        if brand
        else None
    )
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="尚未生成 GEO 评分，请先点击「计算评分」",
        )
    return score


@router.get("/history", response_model=list[ScoreOut])
def get_score_history(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[Score]:
    _require_company(current_user)
    brand = (
        db.query(Brand)
        .filter(Brand.company_id == current_user.company_id)
        .order_by(Brand.created_at)
        .first()
    )
    if not brand:
        return []
    return (
        db.query(Score)
        .filter(Score.brand_id == brand.id)
        .order_by(Score.created_at.asc())
        .all()
    )
