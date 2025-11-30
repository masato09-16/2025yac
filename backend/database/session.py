"""
Database session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings
import logging

logger = logging.getLogger(__name__)

# Create engine
# SQLite specific settings
connect_args = {"check_same_thread": False} if "sqlite" in settings.database_url else {}

# For serverless environments (Vercel), use smaller connection pool
is_serverless = "sqlite" not in settings.database_url
pool_size = 1 if is_serverless else 10
max_overflow = 0 if is_serverless else 20

logger.info(f"Creating database engine: {settings.database_url[:20]}... (pool_size={pool_size}, max_overflow={max_overflow})")

try:
    engine = create_engine(
        settings.database_url,
        echo=settings.database_echo,
        pool_pre_ping=True,
        pool_size=pool_size,
        max_overflow=max_overflow,
        connect_args=connect_args,
        # For serverless, use NullPool to avoid connection issues
        poolclass=None if not is_serverless else None,  # Keep default pool
    )
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

