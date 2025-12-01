"""
Configuration settings for the FastAPI application
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    # Vercel deployment uses Supabase PostgreSQL (required)
    # Supabase connection string format: postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:6543/postgres
    # Note: Use port 6543 (connection pooler) for serverless compatibility
    database_url: str = ""  # Required: Set via DATABASE_URL environment variable
    database_echo: bool = False
    
    # Polling interval for frontend (in milliseconds)
    # Production: 30000ms (30 seconds)
    frontend_polling_interval: int = 30000
    
    # API Settings
    api_v1_prefix: str = "/api/v1"
    debug: bool = False  # Production default
    secret_key: str = ""  # Required: Set via SECRET_KEY environment variable
    
    # Camera Settings
    camera_enabled: bool = False  # Disabled for Vercel (dependencies too large)
    camera_update_interval: int = 5  # seconds
    detection_model_path: str = "yolov8n.pt"  # YOLOv8 model path
    
    # Camera source configuration
    # For PC: use device ID (e.g., "0", "1", "2")
    # For Raspberry Pi: use device path or URL (e.g., "/dev/video0", "http://...")
    camera_source: str = "0"  # Default: PC camera device 0
    camera_type: str = "pc"  # Options: "pc" or "raspberry_pi"
    
    # Redis (optional)
    redis_url: str = ""
    redis_enabled: bool = False
    
    # CORS
    # Set via ALLOWED_ORIGINS environment variable (comma-separated)
    # Example: https://your-app.vercel.app,https://your-custom-domain.com
    # If not set, defaults to empty list (CORS will need to be configured)
    allowed_origins: List[str] = []
    
    # Google OAuth Settings
    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = ""  # Set via GOOGLE_REDIRECT_URI environment variable
    
    # Frontend URL for OAuth redirects
    # Development: http://localhost:8080
    # Production: https://2025yac.vercel.app or your custom domain
    frontend_url: str = "http://localhost:8080"  # Set via FRONTEND_URL environment variable
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="allow",  # Allow extra environment variables to be ignored (e.g., vite_public_builder_key, ping_message)
    )
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Override allowed_origins from environment variable if provided
        if os.getenv("ALLOWED_ORIGINS"):
            self.allowed_origins = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS").split(",")]
        # If still empty and in production, add common Vercel patterns
        if not self.allowed_origins and not self.debug:
            # Allow requests from same origin (Vercel serves both frontend and API)
            self.allowed_origins = ["*"]  # Allow all origins in production (can be restricted via env var)


# Global settings instance
settings = Settings()

