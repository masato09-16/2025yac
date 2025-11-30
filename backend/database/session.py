"""
Database session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings
import logging
import os

logger = logging.getLogger(__name__)

# Validate database URL
if not settings.database_url:
    raise ValueError("DATABASE_URL environment variable is required for Vercel deployment")

if "sqlite" in settings.database_url:
    raise ValueError("SQLite is not supported in Vercel serverless environment. Use PostgreSQL (Supabase).")

# For PostgreSQL, ensure we use connection pooler for serverless (port 6543)
database_url = settings.database_url
connect_args = {}

# Replace direct connection (5432) with connection pooler (6543) for serverless
if ":5432/" in database_url:
    database_url = database_url.replace(":5432/", ":6543/")
    logger.info("Using Supabase connection pooler (port 6543) for serverless compatibility")

# Add connection timeout for PostgreSQL (reduced for serverless)
connect_args["connect_timeout"] = 5  # Reduced from 10 to 5 seconds

# For serverless environments (Vercel), use smaller connection pool
pool_size = 1
max_overflow = 0

# Add pool timeout to prevent hanging connections
pool_timeout = 5  # Maximum time to wait for a connection from the pool

logger.info(f"Creating database engine: {database_url[:50]}... (pool_size={pool_size}, max_overflow={max_overflow})")

try:
    engine = create_engine(
        database_url,
        echo=settings.database_echo,
        pool_pre_ping=True,
        pool_size=pool_size,
        max_overflow=max_overflow,
        pool_timeout=pool_timeout,
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

