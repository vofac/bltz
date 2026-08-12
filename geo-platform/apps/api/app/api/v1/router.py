from fastapi import APIRouter

from app.api.v1 import (
    auth,
    competitors,
    contents,
    dashboard,
    documents,
    health,
    keywords,
    scores,
    strategy,
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(keywords.router)
api_router.include_router(scores.router)
api_router.include_router(dashboard.router)
api_router.include_router(competitors.router)
api_router.include_router(contents.router)
api_router.include_router(strategy.router)
api_router.include_router(documents.router)
