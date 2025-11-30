"""
Database session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings
import logging
import os

logger = logging.getLogger(__name__)

# Create engine
# SQLite specific settings
connect_args = {"check_same_thread": False} if "sqlite" in settings.database_url else {}

# For PostgreSQL, ensure we use connection pooler for serverless (port 6543)
database_url = settings.database_url
is_serverless = "sqlite" not in settings.database_url

if is_serverless and "postgresql" in database_url:
    # Replace direct connection (5432) with connection pooler (6543) for serverless
    if ":5432/" in database_url:
        database_url = database_url.replace(":5432/", ":6543/")
        logger.info("Using Supabase connection pooler (port 6543) for serverless compatibility")
    # Add connection timeout for PostgreSQL
    if "postgresql" in database_url:
        connect_args["connect_timeout"] = 10

# For serverless environments (Vercel), use smaller connection pool
pool_size = 1 if is_serverless else 10
max_overflow = 0 if is_serverless else 20

logger.info(f"Creating database engine: {database_url[:50]}... (pool_size={pool_size}, max_overflow={max_overflow})")

try:
    engine = create_engine(
        database_url,
        echo=settings.database_echo,
        pool_pre_ping=True,
        pool_size=pool_size,
        max_overflow=max_overflow,
        connect_args=connect_args,
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

