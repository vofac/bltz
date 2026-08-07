from app.core.config import get_settings
from app.models.ai_task import AIModel
from app.services.ai_providers.base import AIProvider
from app.services.ai_providers.claude_provider import ClaudeProvider
from app.services.ai_providers.gemini_provider import GeminiProvider
from app.services.ai_providers.mock import MockAIProvider
from app.services.ai_providers.openai_provider import OpenAIProvider
from app.services.ai_providers.perplexity_provider import PerplexityProvider

_LIVE_PROVIDERS = {
    AIModel.OPENAI: OpenAIProvider,
    AIModel.CLAUDE: ClaudeProvider,
    AIModel.GEMINI: GeminiProvider,
    AIModel.PERPLEXITY: PerplexityProvider,
}


def get_ai_provider(model: AIModel) -> AIProvider:
    """按 AIModel 派发到具体 Provider 实现。AI_PROVIDER_MODE=mock（默认）时统一走
    MockAIProvider；AI_PROVIDER_MODE=live 时按 model 派发到对应真实厂商实现，
    对应 API Key 需在 .env 中配置。

    Google AI Overview（AIModel.GOOGLE_AIO）没有官方公开 API——它是 Google 搜索结果页
    的一个展示特性，而非可调用的产品接口。即使在 live 模式下也回退到 MockAIProvider，
    如需真实数据需接入第三方 SERP 抓取服务（如 SerpApi），属于后续可选增强。
    """
    settings = get_settings()
    if settings.AI_PROVIDER_MODE == "mock":
        return MockAIProvider()

    if model == AIModel.GOOGLE_AIO:
        return MockAIProvider()

    provider_cls = _LIVE_PROVIDERS.get(model)
    if provider_cls is None:
        raise NotImplementedError(f"未知的 AIModel: {model}")
    return provider_cls()
