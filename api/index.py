"""
Vercel Functions handler for FastAPI application
"""
import sys
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add backend directory to Python path
# Try multiple possible paths for Vercel deployment
current_file = Path(__file__).resolve()
current_dir = current_file.parent
root_dir = current_dir.parent

# List all possible backend paths
possible_backend_paths = [
    root_dir / "backend",  # Standard structure: /api/index.py -> /backend
    current_dir / "backend",  # If backend is in api/
    Path("/var/task/backend"),  # Vercel function environment
    Path("/var/task") / "backend",  # Alternative Vercel path
    Path(os.getcwd()) / "backend",  # Current working directory
    Path(os.getcwd()),  # If cwd is already backend
]

logger.info(f"Current file: {current_file}")
logger.info(f"Current directory: {current_dir}")
logger.info(f"Root directory: {root_dir}")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Initial Python path: {sys.path}")

# List all files in current directory for debugging
try:
    logger.info(f"Files in current directory: {list(current_dir.iterdir())}")
except Exception as e:
    logger.warning(f"Could not list current directory: {e}")

# List all files in root directory for debugging
try:
    logger.info(f"Files in root directory: {list(root_dir.iterdir())}")
except Exception as e:
    logger.warning(f"Could not list root directory: {e}")

backend_dir = None
for path in possible_backend_paths:
    logger.info(f"Checking path: {path} (exists: {path.exists()})")
    if path.exists():
        # Check if it's a directory and has api subdirectory
        if path.is_dir():
            api_subdir = path / "api"
            if api_subdir.exists():
                backend_dir = path
                logger.info(f"Found backend directory: {backend_dir}")
                break
            else:
                # Maybe the path itself is the backend (if we're already in backend)
                if (path / "config.py").exists() or (path / "api").exists():
                    backend_dir = path
                    logger.info(f"Found backend directory (by config.py): {backend_dir}")
                    break

if backend_dir:
    sys.path.insert(0, str(backend_dir))
    os.chdir(str(backend_dir))  # Change working directory to backend
    logger.info(f"Added {backend_dir} to Python path and changed working directory to {backend_dir}")
    logger.info(f"Updated Python path: {sys.path}")
else:
    # Fallback: try to find backend in current path
    cwd = os.getcwd()
    logger.warning(f"Backend directory not found in standard locations. Current directory: {cwd}")
    
    # Try adding root directory
    sys.path.insert(0, str(root_dir))
    logger.info(f"Added root directory to Python path: {root_dir}")
    
    # Also try current directory if it contains backend files
    if (current_dir / "config.py").exists() or (current_dir / "api").exists():
        sys.path.insert(0, str(current_dir))
        logger.info(f"Added current directory to Python path: {current_dir}")
    
    logger.info(f"Final Python path: {sys.path}")

try:
    logger.info("Attempting to import mangum...")
    from mangum import Mangum
    logger.info("Successfully imported Mangum")
except ImportError as e:
    logger.error(f"Failed to import Mangum: {e}")
    logger.error("Make sure mangum is in api/requirements.txt")
    raise

try:
    logger.info("Importing FastAPI for type checking...")
    from fastapi import FastAPI
    logger.info("FastAPI imported successfully")
except ImportError as e:
    logger.warning(f"Could not import FastAPI for type checking: {e}")
    FastAPI = None  # Fallback if FastAPI is not available

# Check environment variables
logger.info("Checking environment variables...")
database_url = os.getenv("DATABASE_URL", "NOT SET")
if database_url != "NOT SET":
    # Mask password in log
    if "@" in database_url:
        masked_url = database_url.split("@")[0].split("://")[0] + "://***@" + "@".join(database_url.split("@")[1:])
        logger.info(f"DATABASE_URL is set: {masked_url}")
    else:
        logger.info(f"DATABASE_URL is set: {database_url[:50]}...")
else:
    logger.warning("DATABASE_URL is not set! This will cause database connection errors.")
    
logger.info(f"DEBUG: {os.getenv('DEBUG', 'NOT SET')}")
logger.info(f"CAMERA_ENABLED: {os.getenv('CAMERA_ENABLED', 'NOT SET')}")

try:
    logger.info("Attempting to import api.main...")
    # Import app module first to catch any import errors
    import api.main
    logger.info("Successfully imported api.main module")
    
    # Verify app exists and is a FastAPI instance
    if not hasattr(api.main, 'app'):
        raise AttributeError("api.main module does not have 'app' attribute")
    
    app = api.main.app
    logger.info(f"Successfully imported FastAPI app: {type(app)}")
    
    # Verify app is a FastAPI instance (if FastAPI is available for type checking)
    if FastAPI is not None and not isinstance(app, FastAPI):
        raise TypeError(f"app is not a FastAPI instance: {type(app)}")
    
    logger.info("FastAPI app validation passed")
except ImportError as e:
    logger.error(f"Failed to import api.main: {e}")
    logger.error(f"Current Python path: {sys.path}")
    logger.error(f"Current working directory: {os.getcwd()}")
    
    # Try to list what's available
    try:
        import api
        logger.info(f"api module location: {api.__file__}")
    except Exception as e2:
        logger.error(f"Could not find api module: {e2}")
    
    raise
except Exception as e:
    logger.error(f"Unexpected error importing api.main: {e}", exc_info=True)
    raise

try:
    logger.info("Creating Mangum handler...")
    # Create Mangum handler for Vercel Functions
    # Note: lifespan is disabled in FastAPI app for serverless compatibility
    # Database initialization happens on first request via middleware
    handler = Mangum(app, lifespan="off")
    logger.info("Mangum handler created successfully")
    
    # Verify handler is callable
    if not callable(handler):
        raise TypeError(f"Handler is not callable: {type(handler)}")
    logger.info(f"Handler type: {type(handler)}")
        
except Exception as e:
    logger.error(f"Failed to create Mangum handler: {e}", exc_info=True)
    raise

# Export handler for Vercel
# Vercel expects a 'handler' variable or function
__all__ = ["handler"]

