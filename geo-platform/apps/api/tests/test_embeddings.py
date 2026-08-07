from app.services.embeddings.mock import MockEmbeddingProvider


def test_same_text_produces_identical_vector():
    provider = MockEmbeddingProvider()
    v1 = provider.embed(["佰利新材专注环保涂料"])[0]
    v2 = provider.embed(["佰利新材专注环保涂料"])[0]
    assert v1 == v2


def test_different_text_produces_different_vectors():
    provider = MockEmbeddingProvider()
    v1 = provider.embed(["艺术漆十大品牌"])[0]
    v2 = provider.embed(["环保涂料厂家"])[0]
    assert v1 != v2


def test_vectors_are_unit_length():
    provider = MockEmbeddingProvider()
    vector = provider.embed(["测试文本"])[0]
    norm = sum(v * v for v in vector) ** 0.5
    assert abs(norm - 1.0) < 1e-9


def test_embed_preserves_input_order():
    provider = MockEmbeddingProvider()
    texts = ["第一段", "第二段", "第三段"]
    vectors = provider.embed(texts)
    assert len(vectors) == 3
    assert vectors[0] == provider.embed([texts[0]])[0]
