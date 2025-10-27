"""
FastAPI main application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from api.routes import classrooms, occupancy, schedules
from camera.processor import CameraProcessor

logger = logging.getLogger(__name__)

# Global camera processor instance
camera_processor: CameraProcessor | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global camera_processor
    
    # Startup
    logger.info("Starting FastAPI application...")
    
    if settings.camera_enabled:
        camera_processor = CameraProcessor()
        logger.info("Camera processor initialized")
    
    yield
    
    # Shutdown
    if camera_processor:
        camera_processor.stop()
    logger.info("Shutting down FastAPI application...")


# Create FastAPI app
app = FastAPI(
    title="YNU Classroom Occupancy API",
    description="Real-time classroom occupancy monitoring system for Yokohama National University",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(classrooms.router, prefix=settings.api_v1_prefix)
app.include_router(occupancy.router, prefix=settings.api_v1_prefix)
app.include_router(schedules.router, prefix=settings.api_v1_prefix)


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

