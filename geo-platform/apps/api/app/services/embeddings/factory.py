from app.core.config import get_settings
from app.services.embeddings.base import EmbeddingProvider
from app.services.embeddings.mock import MockEmbeddingProvider


def get_embedding_provider() -> EmbeddingProvider:
    settings = get_settings()
    if settings.EMBEDDING_PROVIDER_MODE == "mock":
        return MockEmbeddingProvider()

    raise NotImplementedError(
        "EMBEDDING_PROVIDER_MODE=live 尚未接入真实向量模型，请在 Phase 2 补充实现"
    )
