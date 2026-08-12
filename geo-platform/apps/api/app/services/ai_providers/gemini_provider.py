import google.generativeai as genai

from app.core.config import get_settings
from app.services.ai_providers.base import AIProvider, AIQueryResult
from app.services.ai_providers.text_analysis import find_mention

_ANALYZE_PROMPT = "关于「{keyword}」，你会推荐哪些品牌？请简要说明理由。"


class GeminiProvider(AIProvider):
    name = "gemini"

    def __init__(self) -> None:
        settings = get_settings()
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self._model = genai.GenerativeModel(settings.GEMINI_MODEL)

    def generate(self, prompt: str) -> str:
        response = self._model.generate_content(prompt)
        return response.text or ""

    def analyze(
        self, keyword: str, brand_name: str, brand_aliases: list[str]
    ) -> AIQueryResult:
        answer = self.generate(_ANALYZE_PROMPT.format(keyword=keyword))
        return find_mention(answer, brand_name, brand_aliases)
