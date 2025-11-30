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
possible_backend_paths = [
    current_file.parent.parent / "backend",  # Standard structure
    current_file.parent / "backend",  # If backend is in api/
    Path("/var/task/backend"),  # Vercel function environment
    Path(os.getcwd()) / "backend",  # Current working directory
]

logger.info(f"Current file: {current_file}")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Python path: {sys.path}")

backend_dir = None
for path in possible_backend_paths:
    logger.info(f"Checking path: {path} (exists: {path.exists()})")
    if path.exists() and (path / "api").exists():
        backend_dir = path
        logger.info(f"Found backend directory: {backend_dir}")
        break

if backend_dir:
    sys.path.insert(0, str(backend_dir))
    os.chdir(str(backend_dir))  # Change working directory to backend
    logger.info(f"Added {backend_dir} to Python path and changed working directory")
else:
    # Fallback: try to find backend in current path
    cwd = os.getcwd()
    logger.warning(f"Backend directory not found in standard locations. Current directory: {cwd}")
    if "backend" in cwd:
        sys.path.insert(0, cwd)
        logger.info(f"Added current directory to Python path: {cwd}")
    else:
        # Last resort: add current directory
        parent_dir = Path(__file__).parent.parent
        sys.path.insert(0, str(parent_dir))
        logger.info(f"Added parent directory to Python path: {parent_dir}")

try:
    from mangum import Mangum
    from api.main import app
    
    logger.info("Successfully imported Mangum and FastAPI app")
    
    # Create Mangum handler for Vercel Functions
    handler = Mangum(app, lifespan="off")
    logger.info("Mangum handler created successfully")
except Exception as e:
    logger.error(f"Failed to import or create handler: {e}", exc_info=True)
    raise

