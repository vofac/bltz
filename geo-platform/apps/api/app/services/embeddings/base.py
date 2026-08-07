from abc import ABC, abstractmethod


class EmbeddingProvider(ABC):
    """向量化模型统一接口，镜像 AIProvider 的抽象模式：Phase 1 用 MockEmbeddingProvider
    打通『上传 → 提取 → 分块 → 向量化 → 存入 Qdrant → 检索』全流程，Phase 2 切换到真实
    embedding 模型（如 OpenAI text-embedding-3 / BGE）时无需改动上层调用代码。"""

    name: str
    dimension: int

    @abstractmethod
    def embed(self, texts: list[str]) -> list[list[float]]:
        """批量将文本编码为向量，返回顺序与输入一致。"""
