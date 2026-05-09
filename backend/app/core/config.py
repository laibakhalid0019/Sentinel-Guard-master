from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SentinelGuard"
    API_V1_STR: str = "/api/v1"
    
    # Database - Automatically reads DATABASE_URL from environment
    DATABASE_URL: str = "sqlite+aiosqlite:///./sentinelguard.db"
    
    # CORS - Automatically reads BACKEND_CORS_ORIGINS from environment
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:8000",
        "https://*.vercel.app"  # Allow Vercel deployments
    ]
    
    # Secret Key for security features
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    
    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
