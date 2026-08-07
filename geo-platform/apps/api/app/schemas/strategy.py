from datetime import date

from pydantic import BaseModel


class StrategyTask(BaseModel):
    category: str
    description: str


class DailyStrategy(BaseModel):
    date: date
    tasks: list[StrategyTask]
