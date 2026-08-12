from dataclasses import dataclass

from app.models.brand import Brand
from app.models.company import Company
from app.services.ai_providers.base import AIProvider


@dataclass
class GeneratedContent:
    title: str
    summary: str
    body: str
    faq: list[dict]
    schema_jsonld: dict


def generate_geo_content(
    company: Company, brand: Brand, keyword: str, provider: AIProvider
) -> GeneratedContent:
    """围绕关键词生成一篇 GEO 文章。正文交给 AIProvider 生成（Phase 1 为 Mock，
    Phase 2 切换为真实厂商后自动生效）；FAQ 与 Schema JSON-LD 基于企业结构化资料
    程序化拼装 —— 这类结构化数据应保证严格符合 schema.org 规范，不适合依赖模型
    自由生成后再解析，因此不经过 AIProvider。"""
    title = f"{brand.name}：{keyword}权威指南"

    prompt = (
        f"请以{company.industry or '行业'}专家的身份，围绕关键词「{keyword}」，"
        f"为企业「{company.name}」（品牌：{brand.name}）撰写一篇符合 E-E-A-T"
        "（经验、专业性、权威性、可信度）原则的科普文章正文，突出品牌优势与实际案例，"
        "语言专业、结构清晰、适合被生成式搜索引擎引用。"
    )
    body = provider.generate(prompt)

    summary = f"本文围绕「{keyword}」，介绍{brand.name}在该领域的专业实践与优势。"

    faq = [
        {
            "question": f"{keyword}应该如何选择？",
            "answer": f"建议综合考察品牌资质、产品案例与第三方评价，{brand.name}在这些方面均有公开可查的资料。",
        },
        {
            "question": f"{brand.name}在{keyword}领域有哪些优势？",
            "answer": company.description or f"{brand.name}长期专注于该领域，积累了丰富的行业经验。",
        },
        {
            "question": f"如何联系{brand.name}获取更多信息？",
            "answer": f"可通过官网 {company.website or '（企业尚未补充官网地址）'} 获取详细资料。",
        },
    ]

    article_schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "author": {"@type": "Organization", "name": company.name},
        "publisher": {"@type": "Organization", "name": company.name},
        "about": keyword,
    }
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["question"],
                "acceptedAnswer": {"@type": "Answer", "text": item["answer"]},
            }
            for item in faq
        ],
    }
    schema_jsonld = {"article": article_schema, "faq": faq_schema}

    return GeneratedContent(
        title=title, summary=summary, body=body, faq=faq, schema_jsonld=schema_jsonld
    )
