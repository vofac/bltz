from anthropic import Anthropic

from app.core.config import get_settings
from app.services.ai_providers.base import AIProvider, AIQueryResult
from app.services.ai_providers.text_analysis import find_mention

_ANALYZE_PROMPT = "关于「{keyword}」，你会推荐哪些品牌？请简要说明理由。"


class ClaudeProvider(AIProvider):
    name = "claude"

    def __init__(self) -> None:
        settings = get_settings()
        self._client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self._model = settings.ANTHROPIC_MODEL

    def generate(self, prompt: str) -> str:
        response = self._client.messages.create(
            model=self._model,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        return "".join(
            block.text for block in response.content if getattr(block, "type", None) == "text"
        )

    def analyze(
        self, keyword: str, brand_name: str, brand_aliases: list[str]
    ) -> AIQueryResult:
        answer = self.generate(_ANALYZE_PROMPT.format(keyword=keyword))
        return find_mention(answer, brand_name, brand_aliases)
