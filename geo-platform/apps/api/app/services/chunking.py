def chunk_text(text: str, chunk_size: int = 500) -> list[str]:
    """按固定字符长度切分文本，过滤空白块。Phase 1 MVP 使用简单定长分块；
    更精细的按句子/段落边界分块留待 Phase 2 按需优化。"""
    stripped = text.strip()
    if not stripped:
        return []
    chunks = [stripped[i : i + chunk_size] for i in range(0, len(stripped), chunk_size)]
    return [c.strip() for c in chunks if c.strip()]
