from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "GEO Intelligence Platform API"
    ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+psycopg2://geo:geo@localhost:5432/geo"
    REDIS_URL: str = "redis://localhost:6379/0"
    VECTOR_DB_URL: str = "http://localhost:6333"

    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    AI_PROVIDER_MODE: str = "mock"  # mock | live
    EMBEDDING_PROVIDER_MODE: str = "mock"  # mock | live

    # Phase 2 真实厂商接入：以下模型 ID 为编写时的合理默认值，厂商会持续更新模型版本，
    # 部署前请对照各厂商官方文档确认当前可用的模型 ID，可直接通过 .env 覆盖，无需改代码。
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-latest"
    GOOGLE_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    PERPLEXITY_API_KEY: str = ""
    PERPLEXITY_MODEL: str = "sonar"

    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    STORAGE_DIR: str = "./storage"
    MAX_UPLOAD_SIZE_MB: int = 20


@lru_cache
def get_settings() -> Settings:
    return Settings()
