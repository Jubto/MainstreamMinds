from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_CONN: str

    class Config:
        env_file = ".env.local"


@lru_cache()
def get_settings():
    return Settings()
