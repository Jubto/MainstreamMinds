from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_CONN: str
    REDIS_CONN: str = "redis://localhost:6379"
    CACHE_SIZE: int = 1000

    class Config:
        env_file = ".env.local"


@lru_cache()
def get_settings():
    return Settings()
