from app.services.ai_providers.mock import MockAIProvider


def test_analyze_marks_brand_mentioned_deterministically_with_seed():
    provider = MockAIProvider(mention_probability=1.0, seed=42)
    result = provider.analyze("艺术漆十大品牌", "佰利新材", ["Baili"])

    assert result.brand_mentioned is True
    assert result.mention_position is not None
    assert "佰利新材" in result.raw_answer
    assert len(result.citation_sources) > 0


def test_analyze_never_mentions_brand_when_probability_zero():
    provider = MockAIProvider(mention_probability=0.0, seed=42)
    result = provider.analyze("艺术漆十大品牌", "佰利新材", [])

    assert result.brand_mentioned is False
    assert result.mention_position is None
    assert result.citation_sources == []
    assert "佰利新材" not in result.raw_answer


def test_compare_returns_one_result_per_brand():
    provider = MockAIProvider(seed=1)
    results = provider.compare("艺术漆十大品牌", ["佰利新材", "三棵树", "立邦"])

    assert set(results.keys()) == {"佰利新材", "三棵树", "立邦"}
    for result in results.values():
        assert isinstance(result.brand_mentioned, bool)
