from app.services.ai_providers.perplexity_provider import PerplexityProvider


class _FakeResponseWithAttr:
    citations = ["https://example.com/a", "https://example.com/b"]


class _FakeResponseWithModelExtra:
    citations = None
    model_extra = {"citations": ["https://example.com/c"]}


class _FakeResponseWithNothing:
    pass


def test_extracts_citations_from_direct_attribute():
    result = PerplexityProvider._extract_citations(_FakeResponseWithAttr())
    assert result == ["https://example.com/a", "https://example.com/b"]


def test_extracts_citations_from_model_extra_fallback():
    result = PerplexityProvider._extract_citations(_FakeResponseWithModelExtra())
    assert result == ["https://example.com/c"]


def test_returns_empty_list_when_no_citations_present():
    result = PerplexityProvider._extract_citations(_FakeResponseWithNothing())
    assert result == []
