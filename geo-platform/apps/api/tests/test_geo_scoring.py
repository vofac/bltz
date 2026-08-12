from app.models.company import Company
from app.services.geo_scoring.scorer import (
    ai_understanding_score,
    authority_score,
    content_score,
    trust_score,
)


def _company(**overrides) -> Company:
    defaults = dict(website=None, description=None, industry=None)
    defaults.update(overrides)
    return Company(**defaults)


def test_authority_score_full_marks_when_all_signals_present():
    company = _company(
        website="https://example.com",
        description="x" * 60,
        industry="涂料",
    )
    score, strengths, recommendations = authority_score(company, has_citations=True)

    assert score == 30
    assert len(recommendations) == 0
    assert len(strengths) > 0


def test_authority_score_zero_when_no_signals_present():
    company = _company()
    score, strengths, recommendations = authority_score(company, has_citations=False)

    assert score == 0
    assert len(recommendations) == 4


def test_content_score_caps_at_thirty():
    score, strengths, _ = content_score(contents_count=5, has_faq=True)
    assert score == 30
    assert len(strengths) == 2


def test_content_score_zero_when_no_content():
    score, _, recommendations = content_score(contents_count=0, has_faq=False)
    assert score == 0
    assert len(recommendations) == 3


def test_ai_understanding_score_high_mention_rate():
    score, strengths, recommendations = ai_understanding_score(
        has_schema=True, mention_rate=0.8
    )
    assert score == 20
    assert len(recommendations) == 0
    assert len(strengths) == 2


def test_ai_understanding_score_no_monitoring_yet():
    score, _, recommendations = ai_understanding_score(has_schema=False, mention_rate=None)
    assert score == 0
    assert any("尚未进行关键词监测" in r for r in recommendations)


def test_ai_understanding_score_zero_mention_rate():
    score, _, recommendations = ai_understanding_score(has_schema=False, mention_rate=0.0)
    assert score == 0
    assert any("均未提及品牌" in r for r in recommendations)


def test_trust_score_caps_at_twenty():
    score, strengths, recommendations = trust_score(documents_count=5)
    assert score == 20
    assert len(strengths) == 1
    assert len(recommendations) == 0


def test_trust_score_zero_when_no_documents():
    score, _, recommendations = trust_score(documents_count=0)
    assert score == 0
    assert len(recommendations) == 2
