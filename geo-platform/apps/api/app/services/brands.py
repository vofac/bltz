from sqlalchemy.orm import Session

from app.models.brand import Brand
from app.models.company import Company


def get_or_create_default_brand(db: Session, company: Company) -> Brand:
    """Phase 1 简化：企业尚未显式创建品牌时，复用/创建以企业名命名的默认品牌，
    避免强制用户先走一遍单独的品牌创建流程。关键词监测与 GEO 评分共用此逻辑。"""
    brand = (
        db.query(Brand)
        .filter(Brand.company_id == company.id)
        .order_by(Brand.created_at)
        .first()
    )
    if brand:
        return brand

    brand = Brand(company_id=company.id, name=company.name)
    db.add(brand)
    db.flush()
    return brand
