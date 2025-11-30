"""
Configuration settings for the FastAPI application
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    # Default to SQLite for development, use Supabase PostgreSQL for production
    # Supabase connection string format: postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
    database_url: str = "sqlite:///./ynu_classrooms.db"
    database_echo: bool = False
    
    # Polling interval for frontend (in milliseconds)
    # Development: 5000ms (5 seconds), Production: 30000ms (30 seconds)
    frontend_polling_interval: int = 5000
    
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
    # Can be overridden with ALLOWED_ORIGINS environment variable (comma-separated)
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
    
    # Google OAuth Settings
    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/api/v1/auth/callback"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Override allowed_origins from environment variable if provided
        if os.getenv("ALLOWED_ORIGINS"):
            self.allowed_origins = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS").split(",")]


# Global settings instance
settings = Settings()

