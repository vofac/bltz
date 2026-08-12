from app.services.chunking import chunk_text


def test_empty_text_returns_no_chunks():
    assert chunk_text("") == []
    assert chunk_text("   \n  ") == []


def test_short_text_returns_single_chunk():
    assert chunk_text("你好世界", chunk_size=500) == ["你好世界"]


def test_long_text_splits_by_chunk_size():
    text = "字" * 1200
    chunks = chunk_text(text, chunk_size=500)
    assert len(chunks) == 3
    assert chunks[0] == "字" * 500
    assert chunks[-1] == "字" * 200
