from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class AIQueryResult:
    raw_answer: str
    brand_mentioned: bool
    mention_position: int | None
    citation_sources: list[str] = field(default_factory=list)
    competitor_brands_mentioned: list[str] = field(default_factory=list)


class AIProvider(ABC):
    """统一的 AI 厂商调用抽象。新增厂商（Phase 2）只需实现这三个方法，
    上层业务代码（关键词监测、内容优化等）不需要改动。"""

    name: str

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """给定任意 prompt，返回模型原始回答文本（供内容优化助手等场景使用）。"""

    @abstractmethod
    def analyze(
        self, keyword: str, brand_name: str, brand_aliases: list[str]
    ) -> AIQueryResult:
        """针对某关键词提问，分析回答中目标品牌的提及情况，返回结构化结果。"""

    @abstractmethod
    def compare(self, keyword: str, brand_names: list[str]) -> dict[str, AIQueryResult]:
        """对多个品牌在同一关键词下的表现做对比（供竞品分析场景使用）。"""
