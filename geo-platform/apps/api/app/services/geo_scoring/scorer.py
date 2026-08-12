from dataclasses import dataclass

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.ai_result import AIResult
from app.models.ai_task import AITask
from app.models.brand import Brand
from app.models.company import Company
from app.models.content import Content
from app.models.document import Document
from app.models.keyword import Keyword


@dataclass
class ScoreBreakdown:
    authority_score: int
    content_score: int
    ai_understanding_score: int
    trust_score: int
    total_score: int
    strengths: list[str]
    recommendations: list[str]


def authority_score(company: Company, has_citations: bool) -> tuple[int, list[str], list[str]]:
    """品牌权威（满分30）：官网/企业介绍/行业信息/第三方引用。"""
    score = 0
    strengths: list[str] = []
    recommendations: list[str] = []

    if company.website:
        score += 10
    else:
        recommendations.append("补充企业官网地址，提升品牌可信度")

    if company.description and len(company.description) >= 50:
        score += 5
    else:
        recommendations.append("完善企业介绍，建议不少于 50 字")

    if has_citations:
        score += 10
        strengths.append("已被第三方来源引用，品牌权威性较好")
    else:
        recommendations.append("争取行业媒体、第三方平台的报道与引用")

    if company.industry:
        score += 5
    else:
        recommendations.append("补充所属行业信息")

    return score, strengths, recommendations


def content_score(contents_count: int, has_faq: bool) -> tuple[int, list[str], list[str]]:
    """内容覆盖（满分30）：产品页面/行业文章数量与 FAQ 覆盖。"""
    score = 0
    strengths: list[str] = []
    recommendations: list[str] = []

    if contents_count >= 1:
        score += 10
    else:
        recommendations.append("发布至少一篇产品或行业相关内容")

    if contents_count >= 3:
        score += 10
        strengths.append("内容覆盖度较好，已发布多篇相关内容")
    else:
        recommendations.append("持续产出行业文章，建议累计 3 篇以上")

    if has_faq:
        score += 10
        strengths.append("已包含 FAQ 内容，有助于 AI 理解常见问题")
    else:
        recommendations.append("为核心内容补充 FAQ，覆盖用户常见提问")

    return score, strengths, recommendations


def ai_understanding_score(
    has_schema: bool, mention_rate: float | None
) -> tuple[int, list[str], list[str]]:
    """AI 理解度（满分20）：Schema 结构化数据 + 关键词监测中的品牌提及率。"""
    score = 0
    strengths: list[str] = []
    recommendations: list[str] = []

    if has_schema:
        score += 10
        strengths.append("内容已包含结构化数据（Schema），利于 AI 理解")
    else:
        recommendations.append("为内容补充 Schema JSON-LD 结构化数据")

    if mention_rate is None:
        recommendations.append("尚未进行关键词监测，建议先运行 AI 搜索监测")
    elif mention_rate >= 0.5:
        score += 10
        strengths.append("在多数 AI 引擎的回答中被提及，品牌可见度良好")
    elif mention_rate > 0:
        score += 5
        recommendations.append("部分 AI 引擎未提及品牌，建议加强内容覆盖")
    else:
        recommendations.append("当前关键词监测中 AI 引擎均未提及品牌，需重点优化")

    return score, strengths, recommendations


def trust_score(documents_count: int) -> tuple[int, list[str], list[str]]:
    """用户信任（满分20）：企业资质/案例材料数量。"""
    score = 0
    strengths: list[str] = []
    recommendations: list[str] = []

    if documents_count >= 1:
        score += 10
        strengths.append("已上传企业资质 / 案例材料")
    else:
        recommendations.append("上传企业资质、案例或第三方评价等证明材料")

    if documents_count >= 3:
        score += 10
    else:
        recommendations.append("持续补充案例与资质材料，建议累计 3 份以上")

    return score, strengths, recommendations


def compute_score(db: Session, company: Company, brand: Brand) -> ScoreBreakdown:
    contents_count = db.query(Content).filter(Content.company_id == company.id).count()
    has_faq = (
        db.query(Content)
        .filter(Content.company_id == company.id, Content.faq.isnot(None))
        .count()
        > 0
    )
    has_schema = (
        db.query(Content)
        .filter(Content.company_id == company.id, Content.schema_jsonld.isnot(None))
        .count()
        > 0
    )
    documents_count = db.query(Document).filter(Document.company_id == company.id).count()

    total_tasks = (
        db.query(AITask)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company.id)
        .count()
    )
    mentioned_tasks = (
        db.query(AIResult)
        .join(AITask, AIResult.ai_task_id == AITask.id)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company.id, AIResult.brand_mentioned.is_(True))
        .count()
    )
    mention_rate = (mentioned_tasks / total_tasks) if total_tasks else None

    has_citations = (
        db.query(AIResult)
        .join(AITask, AIResult.ai_task_id == AITask.id)
        .join(Keyword, AITask.keyword_id == Keyword.id)
        .filter(Keyword.company_id == company.id)
        .filter(func.cardinality(AIResult.citation_sources) > 0)
        .count()
        > 0
    )

    authority, s1, r1 = authority_score(company, has_citations)
    content, s2, r2 = content_score(contents_count, has_faq)
    ai_understanding, s3, r3 = ai_understanding_score(has_schema, mention_rate)
    trust, s4, r4 = trust_score(documents_count)

    return ScoreBreakdown(
        authority_score=authority,
        content_score=content,
        ai_understanding_score=ai_understanding,
        trust_score=trust,
        total_score=authority + content + ai_understanding + trust,
        strengths=s1 + s2 + s3 + s4,
        recommendations=r1 + r2 + r3 + r4,
    )
