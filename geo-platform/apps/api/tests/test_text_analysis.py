from app.services.ai_providers.text_analysis import find_mention


def test_finds_brand_in_first_sentence():
    answer = "佰利新材是不错的选择。三棵树也很受欢迎。"
    result = find_mention(answer, "佰利新材", [])
    assert result.brand_mentioned is True
    assert result.mention_position == 1


def test_finds_brand_in_later_sentence():
    answer = "市场上有很多选择。经过对比，佰利新材的口碑最好。"
    result = find_mention(answer, "佰利新材", [])
    assert result.brand_mentioned is True
    assert result.mention_position == 2


def test_finds_brand_via_alias():
    answer = "Baili is a great choice for eco-friendly paint."
    result = find_mention(answer, "佰利新材", ["Baili"])
    assert result.brand_mentioned is True


def test_case_insensitive_alias_match():
    answer = "BAILI offers excellent products."
    result = find_mention(answer, "佰利新材", ["baili"])
    assert result.brand_mentioned is True


def test_brand_not_mentioned():
    answer = "三棵树和立邦是市场上的知名品牌。"
    result = find_mention(answer, "佰利新材", [])
    assert result.brand_mentioned is False
    assert result.mention_position is None


def test_competitor_and_citations_always_empty():
    answer = "佰利新材值得推荐。"
    result = find_mention(answer, "佰利新材", [])
    assert result.competitor_brands_mentioned == []
    assert result.citation_sources == []


def test_raw_answer_preserved_verbatim():
    answer = "任意原始回答文本"
    result = find_mention(answer, "无关品牌", [])
    assert result.raw_answer == answer
