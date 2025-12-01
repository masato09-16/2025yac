"""
FastAPI main application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from config import settings
from api.routes import classrooms, occupancy, schedules, auth, favorites, search_history

logger = logging.getLogger(__name__)

# Camera functionality is completely disabled for Vercel deployment
# All camera-related imports and code are skipped to avoid dependency issues

# Database is expected to be already initialized in Supabase
# No runtime initialization needed in serverless environment

# Create FastAPI app
app = FastAPI(
    title="YNU Classroom Occupancy API",
    description="Real-time classroom occupancy monitoring system for Yokohama National University",
    version="1.0.0",
)

# CORS middleware
# If allowed_origins is empty, allow all origins (for Vercel deployment)
cors_origins = settings.allowed_origins if settings.allowed_origins else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# No middleware needed - database is pre-initialized in Supabase

# Include routers
app.include_router(classrooms.router, prefix=settings.api_v1_prefix)
app.include_router(occupancy.router, prefix=settings.api_v1_prefix)
app.include_router(schedules.router, prefix=settings.api_v1_prefix)

# Camera router - enable for local development only
if settings.camera_enabled:
    from api.routes import camera
    app.include_router(camera.router, prefix=settings.api_v1_prefix)
    logger.info("Camera routes enabled")
else:
    logger.info("Camera routes disabled (set CAMERA_ENABLED=true to enable)")

app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(favorites.router, prefix=settings.api_v1_prefix)
app.include_router(search_history.router, prefix=settings.api_v1_prefix)

# Static files mounting is disabled for Vercel serverless deployment
# Static files should be served via Vercel's static file serving or CDN


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
