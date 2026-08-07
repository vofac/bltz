import hashlib
import random

from app.services.embeddings.base import EmbeddingProvider


class MockEmbeddingProvider(EmbeddingProvider):
    """基于文本哈希生成确定性的伪随机单位向量：相同文本总是得到相同向量，不同文本
    大概率得到不同向量，足以打通存储/检索链路的正确性验证，但不具备真实语义相似度——
    检索结果不能反映『意思相近』，仅反映『文本完全相同或恰好哈希接近』。"""

    name = "mock"
    dimension = 32

    def embed(self, texts: list[str]) -> list[list[float]]:
        return [self._embed_one(text) for text in texts]

    def _embed_one(self, text: str) -> list[float]:
        seed = int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16) % (2**32)
        rng = random.Random(seed)
        vector = [rng.uniform(-1, 1) for _ in range(self.dimension)]
        norm = sum(v * v for v in vector) ** 0.5 or 1.0
        return [v / norm for v in vector]
