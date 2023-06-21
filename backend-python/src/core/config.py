import os
from typing import Any, Dict, Optional

from pydantic import BaseSettings, PostgresDsn, validator


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    POSTGRES_SERVER: str = os.getenv("POSTGRES_HOST", "127.0.0.1:5432")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "postgres")
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = PostgresDsn.build(
        scheme="postgresql",
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "postgres"),
        host=os.getenv("POSTGRES_HOST", "127.0.0.1:5432"),
        path=f"/{os.getenv('POSTGRES_DB', 'postgres')}",
    )


@validator("SQLALCHEMY_DATABASE_URI", pre=True)
def assemble_db_connection(v: Optional[str], values: Dict[str, Any]) -> Any:
    if isinstance(v, str):
        return v
    return PostgresDsn.build(
        scheme="postgresql",
        user=values.get("POSTGRES_USER"),
        password=values.get("POSTGRES_PASSWORD"),
        host=values.get("POSTGRES_SERVER"),
        path=f"/{values.get('POSTGRES_DB') or ''}",
    )


Configuration = Settings()
