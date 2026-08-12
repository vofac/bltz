import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.competitor import Competitor
from app.models.user import User
from app.schemas.competitor import ComparisonResult, CompetitorCreate, CompetitorOut
from app.services.competitor_analysis import build_comparison

router = APIRouter(prefix="/competitors", tags=["competitors"])


def _require_company(current_user: User) -> None:
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前账户未关联企业")


@router.post("", response_model=CompetitorOut, status_code=status.HTTP_201_CREATED)
def create_competitor(
    payload: CompetitorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Competitor:
    _require_company(current_user)
    competitor = Competitor(
        company_id=current_user.company_id, name=payload.name, website=payload.website
    )
    db.add(competitor)
    db.commit()
    db.refresh(competitor)
    return competitor


@router.get("", response_model=list[CompetitorOut])
def list_competitors(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[Competitor]:
    _require_company(current_user)
    return (
        db.query(Competitor)
        .filter(Competitor.company_id == current_user.company_id)
        .order_by(Competitor.created_at.desc())
        .all()
    )


@router.delete("/{competitor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_competitor(
    competitor_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    _require_company(current_user)
    competitor = db.get(Competitor, competitor_id)
    if not competitor or competitor.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="竞品不存在")
    db.delete(competitor)
    db.commit()


@router.get("/comparison", response_model=ComparisonResult)
def get_comparison(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> ComparisonResult:
    _require_company(current_user)
    return build_comparison(db, current_user.company_id)
