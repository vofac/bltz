import re

from app.services.ai_providers.base import AIQueryResult

_SENTENCE_BOUNDARY = re.compile(r"(?<=[。！？.!?])\s*")


def find_mention(answer: str, brand_name: str, brand_aliases: list[str]) -> AIQueryResult:
    """在真实厂商的自由文本回答中查找目标品牌。与 MockAIProvider 不同，这里没有一份
    已知竞品名单可供比对，因此：
    - mention_position 取『品牌首次出现所在的句子序号』（不是『在多个品牌中的排名』，
      这与 Mock 模式的语义不同，属于真实场景下的合理近似）；
    - competitor_brands_mentioned 恒为空列表——从自由文本中可靠识别『竞品实体』
      需要专门的实体识别能力，超出 Phase 2 首版范围，后续可结合竞品名单做子串匹配。
    """
    names = [n for n in (brand_name, *brand_aliases) if n]
    sentences = [s for s in _SENTENCE_BOUNDARY.split(answer) if s]

    mention_position: int | None = None
    for idx, sentence in enumerate(sentences, start=1):
        lowered = sentence.lower()
        if any(name.lower() in lowered for name in names):
            mention_position = idx
            break

    return AIQueryResult(
        raw_answer=answer,
        brand_mentioned=mention_position is not None,
        mention_position=mention_position,
        citation_sources=[],
        competitor_brands_mentioned=[],
    )
