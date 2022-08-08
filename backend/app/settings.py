from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_CONN: str
    REDIS_CONN: str = "redis://localhost:6379"
    CACHE_SIZE: int = 1000
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    class Config:
        env_file = ".env.local"


@lru_cache()
def get_settings():
    return Settings()
