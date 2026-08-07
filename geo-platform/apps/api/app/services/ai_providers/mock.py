import random

from app.services.ai_providers.base import AIProvider, AIQueryResult

_MENTION_TEMPLATES = [
    "根据公开资料，在「{keyword}」相关领域中，业内认可度较高的品牌包括 {brands}。",
    "对于「{keyword}」，目前市场上主流的选择有 {brands}，可根据具体场景选购。",
]
_NO_MENTION_TEMPLATES = [
    "「{keyword}」方向暂未检索到明确的品牌推荐信息，建议结合官网与第三方评测进一步确认。",
]
_DEFAULT_COMPETITORS = ["三棵树", "立邦", "晨阳"]


class MockAIProvider(AIProvider):
    """Phase 1 默认 Provider：无需真实 API Key 即可打通关键词监测/评分全流程。
    通过 .env 中 AI_PROVIDER_MODE=live 切换为真实厂商调用，业务代码无需改动。"""

    name = "mock"

    def __init__(self, mention_probability: float = 0.6, seed: int | None = None) -> None:
        self._mention_probability = mention_probability
        self._random = random.Random(seed)

    def generate(self, prompt: str) -> str:
        return f"[MOCK] 已收到请求：{prompt[:80]}"

    def analyze(
        self, keyword: str, brand_name: str, brand_aliases: list[str]
    ) -> AIQueryResult:
        mentioned = self._random.random() < self._mention_probability
        competitors = self._random.sample(
            _DEFAULT_COMPETITORS, k=min(2, len(_DEFAULT_COMPETITORS))
        )

        brands_in_answer = ([brand_name] if mentioned else []) + competitors
        self._random.shuffle(brands_in_answer)

        template = self._random.choice(
            _MENTION_TEMPLATES if brands_in_answer else _NO_MENTION_TEMPLATES
        )
        answer = template.format(keyword=keyword, brands="、".join(brands_in_answer))

        mention_position = brands_in_answer.index(brand_name) + 1 if mentioned else None

        return AIQueryResult(
            raw_answer=answer,
            brand_mentioned=mentioned,
            mention_position=mention_position,
            citation_sources=["mock-source-1", "mock-source-2"] if mentioned else [],
            competitor_brands_mentioned=competitors,
        )

    def compare(self, keyword: str, brand_names: list[str]) -> dict[str, AIQueryResult]:
        return {name: self.analyze(keyword, name, []) for name in brand_names}
