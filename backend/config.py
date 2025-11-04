"""
Configuration settings for the FastAPI application
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    database_url: str = "sqlite:///./ynu_classrooms.db"
    database_echo: bool = False
    
    # API Settings
    api_v1_prefix: str = "/api/v1"
    debug: bool = True
    secret_key: str = "your-secret-key-change-in-production"
    
    # Camera Settings
    camera_enabled: bool = True
    camera_update_interval: int = 5  # seconds
    detection_model_path: str = "models/yolov8n.pt"
    
    # Redis (optional)
    redis_url: str = "redis://localhost:6379/0"
    redis_enabled: bool = False
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:8080",
        "http://localhost:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:3000",
        # Vite default dev ports
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()

