from openai import OpenAI

from app.core.config import get_settings
from app.services.ai_providers.base import AIProvider, AIQueryResult
from app.services.ai_providers.text_analysis import find_mention

_ANALYZE_PROMPT = "关于「{keyword}」，你会推荐哪些品牌？请简要说明理由。"
_PERPLEXITY_BASE_URL = "https://api.perplexity.ai"


class PerplexityProvider(AIProvider):
    """Perplexity 提供与 OpenAI 兼容的 Chat Completions API（不同的 base_url），
    因此复用 openai SDK 而非单独的客户端库。与其他厂商不同，Perplexity 的回答
    会在响应中附带真实的引用来源 URL（citations），这里会一并提取填充。"""

    name = "perplexity"

    def __init__(self) -> None:
        settings = get_settings()
        self._client = OpenAI(api_key=settings.PERPLEXITY_API_KEY, base_url=_PERPLEXITY_BASE_URL)
        self._model = settings.PERPLEXITY_MODEL

    def generate(self, prompt: str) -> str:
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content or ""

    def analyze(
        self, keyword: str, brand_name: str, brand_aliases: list[str]
    ) -> AIQueryResult:
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[{"role": "user", "content": _ANALYZE_PROMPT.format(keyword=keyword)}],
        )
        answer = response.choices[0].message.content or ""
        result = find_mention(answer, brand_name, brand_aliases)
        result.citation_sources = self._extract_citations(response)
        return result

    @staticmethod
    def _extract_citations(response: object) -> list[str]:
        citations = getattr(response, "citations", None)
        if citations is None:
            extra = getattr(response, "model_extra", None) or {}
            citations = extra.get("citations")
        return list(citations) if citations else []
