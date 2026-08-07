import pytest

from app.core.config import get_settings
from app.models.ai_task import AIModel
from app.services.ai_providers.claude_provider import ClaudeProvider
from app.services.ai_providers.factory import get_ai_provider
from app.services.ai_providers.gemini_provider import GeminiProvider
from app.services.ai_providers.mock import MockAIProvider
from app.services.ai_providers.openai_provider import OpenAIProvider
from app.services.ai_providers.perplexity_provider import PerplexityProvider


@pytest.fixture(autouse=True)
def _clear_settings_cache():
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def test_mock_mode_always_returns_mock_provider(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER_MODE", "mock")
    assert isinstance(get_ai_provider(AIModel.OPENAI), MockAIProvider)
    assert isinstance(get_ai_provider(AIModel.PERPLEXITY), MockAIProvider)


def test_live_mode_dispatches_to_matching_provider(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER_MODE", "live")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")
    monkeypatch.setenv("GOOGLE_API_KEY", "test-key")
    monkeypatch.setenv("PERPLEXITY_API_KEY", "test-key")

    assert isinstance(get_ai_provider(AIModel.OPENAI), OpenAIProvider)
    assert isinstance(get_ai_provider(AIModel.CLAUDE), ClaudeProvider)
    assert isinstance(get_ai_provider(AIModel.GEMINI), GeminiProvider)
    assert isinstance(get_ai_provider(AIModel.PERPLEXITY), PerplexityProvider)


def test_live_mode_google_ai_overview_falls_back_to_mock(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER_MODE", "live")
    assert isinstance(get_ai_provider(AIModel.GOOGLE_AIO), MockAIProvider)


def test_openai_provider_analyze_delegates_to_find_mention(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    provider = OpenAIProvider()
    monkeypatch.setattr(provider, "generate", lambda prompt: "佰利新材表现出色。")

    result = provider.analyze("艺术漆十大品牌", "佰利新材", [])

    assert result.brand_mentioned is True
    assert result.mention_position == 1


def test_claude_provider_analyze_delegates_to_find_mention(monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")
    provider = ClaudeProvider()
    monkeypatch.setattr(provider, "generate", lambda prompt: "市场上没有明确推荐。")

    result = provider.analyze("艺术漆十大品牌", "佰利新材", [])

    assert result.brand_mentioned is False
