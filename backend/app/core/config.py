"""
ArthaNova — Application Configuration
Reads from .env file using pydantic & python-dotenv
"""

import os
import json
from typing import List, Union
from pydantic import BaseModel, ConfigDict, field_validator
from functools import lru_cache
from dotenv import load_dotenv

# Load .env file explicitly
load_dotenv()

class Settings(BaseModel):
    # App
    APP_NAME: str = "ArthaNova"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    SECRET_KEY: str = "dummy_secret" # Fallback if missing
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    DATABASE_URL: str = ""
    DATABASE_URL_SYNC: str = ""

    # JWT
    JWT_SECRET_KEY: str = "dummy_jwt_secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Groq AI
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"

    # Market Data APIs
    # News & Intelligence
    NEWS_API_KEY: str = ""
    
    # Stock Market Data Providers
    ALPHA_VANTAGE_API_KEY: str = ""
    POLYGON_API_KEY: str = ""
    MARKETSTACK_API_KEY: str = ""
    FINNHUB_API_KEY: str = ""
    RAPIDAPI_KEY: str = ""
    
    # Image Generation
    STABILITY_API_KEY: str = ""
    
    # Video Generation  
    PIKA_API_KEY: str = ""

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@arthanova.in"

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 10485760  # 10MB

    # Sentry
    SENTRY_DSN: str = ""

    # Allow extra environment variables without error
    model_config = ConfigDict(  # type: ignore
        extra="ignore",
        case_sensitive=True,
        str_strip_whitespace=True
    )

    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, list]) -> list:
        if isinstance(v, str):
            try:
                # Try JSON list first
                res = json.loads(v)
                return res if isinstance(res, list) else [str(res)]
            except json.JSONDecodeError:
                # Fallback to comma-separated
                return [s.strip() for s in v.split(",") if s.strip()]
        return v if isinstance(v, list) else []

    @field_validator('DEBUG', 'SMTP_PORT', 'JWT_ACCESS_TOKEN_EXPIRE_MINUTES', 'JWT_REFRESH_TOKEN_EXPIRE_DAYS', 'MAX_FILE_SIZE', mode='before')
    @classmethod
    def parse_env_value(cls, v: Union[str, int, bool]) -> Union[int, bool]:  # type: ignore
        if isinstance(v, str):
            # For int fields
            if v.isdigit() or (v.startswith('-') and v[1:].isdigit()):
                return int(v)
            # For bool fields
            if v.lower() in ("true", "1", "yes"):
                return True
            if v.lower() in ("false", "0", "no"):
                return False
        return v  # type: ignore


@lru_cache()
def get_settings() -> Settings:
    # Initialize Settings from environment variables
    # Pydantic will pick environment keys matching the field names
    # Note: .env values are loaded into os.environ by load_dotenv()
    env_data = {k: v for k, v in os.environ.items() if k in Settings.model_fields or k.isupper()}
    try:
        return Settings(**env_data)  # type: ignore
    except Exception:
        # Fallback to defaults if env parsing fails
        return Settings()


settings = get_settings()
