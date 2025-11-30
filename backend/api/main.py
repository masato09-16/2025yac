"""
FastAPI main application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
from pathlib import Path

from config import settings
from api.routes import classrooms, occupancy, schedules, auth, favorites, search_history
from utils.db_init import init_database

logger = logging.getLogger(__name__)

# Camera functionality is completely disabled for Vercel deployment
# All camera-related imports and code are skipped to avoid dependency issues

# Database initialization flag (for serverless environments)
_db_initialized = False

def ensure_database_initialized():
    """Ensure database is initialized (lazy initialization for serverless)"""
    global _db_initialized
    if not _db_initialized:
        try:
            init_database()
            logger.info("Database initialized/seeding checked")
            _db_initialized = True
        except Exception as e:
            logger.exception("Database initialization failed: %s", e)
            # Don't raise - allow app to continue, but log the error

# Create FastAPI app
# Note: lifespan is removed for Vercel serverless compatibility
app = FastAPI(
    title="YNU Classroom Occupancy API",
    description="Real-time classroom occupancy monitoring system for Yokohama National University",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to ensure database is initialized on first request
@app.middleware("http")
async def init_db_middleware(request, call_next):
    """Middleware to ensure database is initialized"""
    ensure_database_initialized()
    response = await call_next(request)
    return response

# Include routers
app.include_router(classrooms.router, prefix=settings.api_v1_prefix)
app.include_router(occupancy.router, prefix=settings.api_v1_prefix)
app.include_router(schedules.router, prefix=settings.api_v1_prefix)
# Camera router is disabled for Vercel deployment
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(favorites.router, prefix=settings.api_v1_prefix)
app.include_router(search_history.router, prefix=settings.api_v1_prefix)

# 静的ファイルのマウント（解析結果画像をブラウザで表示可能にする）
# backendディレクトリを基準にstaticディレクトリを指定
backend_dir = Path(__file__).parent.parent
static_dir = backend_dir / "static"
static_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "YNU Classroom Occupancy API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "camera_enabled": settings.camera_enabled,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
    )

