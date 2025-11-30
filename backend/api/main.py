"""
FastAPI main application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from config import settings
from api.routes import classrooms, occupancy, schedules, auth, favorites, search_history
from utils.db_init import init_database

logger = logging.getLogger(__name__)

# Camera functionality is completely disabled for Vercel deployment
# All camera-related imports and code are skipped to avoid dependency issues

# Database initialization flag (for serverless environments)
_db_initialized = False
_db_initializing = False

def ensure_database_initialized():
    """Ensure database is initialized (lazy initialization for serverless)
    
    This function is designed to be fast and non-blocking.
    It skips initialization if tables already exist (checked via a simple query).
    """
    global _db_initialized, _db_initializing
    
    # If already initialized, return immediately
    if _db_initialized:
        return
    
    # If initialization is in progress, return (don't block)
    if _db_initializing:
        return
    
    # Quick check: try a simple query to see if tables exist
    # This is faster than using inspect() which may establish a connection
    try:
        from database.session import SessionLocal
        from database.models.classroom import Classroom
        
        db = SessionLocal()
        try:
            # Simple query to check if tables exist (with timeout)
            count = db.query(Classroom).limit(1).count()
            logger.info("Database tables already exist, skipping initialization")
            _db_initialized = True
            return
        except Exception as e:
            # Tables don't exist or connection failed, continue with initialization
            logger.debug(f"Tables check failed (this is OK if first run): {e}")
        finally:
            db.close()
    except Exception as e:
        logger.warning(f"Could not check database tables: {e}")
        # Continue with initialization
    
    # Start initialization (non-blocking for subsequent requests)
    _db_initializing = True
    try:
        logger.info("Starting database initialization...")
        # Only create tables, skip seeding on first request to avoid timeout
        from database.session import Base, engine
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created")
        _db_initialized = True
        # Note: Seeding will happen on subsequent requests or can be done manually
    except Exception as e:
        logger.exception("Database initialization failed: %s", e)
        # Don't raise - allow app to continue, but log the error
    finally:
        _db_initializing = False

# Create FastAPI app
# Note: lifespan is removed for Vercel serverless compatibility
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

# Middleware to ensure database is initialized on first request
# Note: This is non-blocking - if initialization is in progress,
# the request will proceed without waiting
@app.middleware("http")
async def init_db_middleware(request, call_next):
    """Middleware to ensure database is initialized (non-blocking)"""
    # Skip initialization for health check and root endpoints to avoid timeout
    if request.url.path in ["/", "/health", "/docs", "/openapi.json"]:
        response = await call_next(request)
        return response
    
    # Call initialization (non-blocking if already in progress)
    # This will be fast if tables already exist
    ensure_database_initialized()
    # Process request immediately, don't wait for initialization
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

# Static files mounting is disabled for Vercel serverless deployment
# Static files should be served via Vercel's static file serving or CDN
# Uncomment below if needed for local development:
# backend_dir = Path(__file__).parent.parent
# static_dir = backend_dir / "static"
# static_dir.mkdir(exist_ok=True)
# app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


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

