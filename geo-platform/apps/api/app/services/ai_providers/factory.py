from app.core.config import get_settings
from app.models.ai_task import AIModel
from app.services.ai_providers.base import AIProvider
from app.services.ai_providers.mock import MockAIProvider


def get_ai_provider(model: AIModel) -> AIProvider:
    """按 AIModel 派发到具体 Provider 实现。Phase 1 统一走 MockAIProvider；
    Phase 2 在 AI_PROVIDER_MODE=live 时按 model 派发到 OpenAIProvider /
    ClaudeProvider / GeminiProvider / PerplexityProvider 等真实实现。"""
    settings = get_settings()
    if settings.AI_PROVIDER_MODE == "mock":
        return MockAIProvider()

    raise NotImplementedError(
        f"AI_PROVIDER_MODE=live 尚未接入 {model.value}，请在 Phase 2 补充对应 Provider 实现"
    )
