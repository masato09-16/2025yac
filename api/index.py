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

# --- パス設定 ---
current_file = Path(__file__).resolve()
current_dir = current_file.parent
root_dir = current_dir.parent

# List all possible backend paths
possible_backend_paths = [
    root_dir / "backend",
    current_dir / "backend",
    Path("/var/task/backend"),
    Path("/var/task") / "backend",
    Path(os.getcwd()) / "backend",
    Path(os.getcwd()),
]

# Backendディレクトリを探索して sys.path に追加
backend_dir = None
for path in possible_backend_paths:
    if path.exists():
        if path.is_dir():
            api_subdir = path / "api"
            if api_subdir.exists():
                backend_dir = path
                logger.info(f"Found backend directory: {backend_dir}")
                break
            else:
                if (path / "config.py").exists() or (path / "api").exists():
                    backend_dir = path
                    logger.info(f"Found backend directory (by config.py): {backend_dir}")
                    break

if backend_dir:
    sys.path.insert(0, str(backend_dir))
    os.chdir(str(backend_dir))
    logger.info(f"Added {backend_dir} to Python path and changed working directory to {backend_dir}")
else:
    sys.path.insert(0, str(root_dir))
    if (current_dir / "config.py").exists() or (current_dir / "api").exists():
        sys.path.insert(0, str(current_dir))
    logger.info(f"Added root directory to Python path: {root_dir}")

# --- 環境変数の確認 (デバッグ用) ---
logger.info("Checking environment variables...")
database_url = os.getenv("DATABASE_URL", "NOT SET")
if database_url != "NOT SET":
    if "@" in database_url:
        masked_url = database_url.split("@")[0].split("://")[0] + "://***@" + "@".join(database_url.split("@")[1:])
        logger.info(f"DATABASE_URL is set: {masked_url}")
    else:
        logger.info(f"DATABASE_URL is set: {database_url[:50]}...")
else:
    logger.warning("DATABASE_URL is not set!")

logger.info(f"DEBUG: {os.getenv('DEBUG', 'NOT SET')}")
logger.info(f"CAMERA_ENABLED: {os.getenv('CAMERA_ENABLED', 'NOT SET')}")

# --- 【重要】FastAPIのappを直接インポート ---
# Mangumは使用せず、FastAPIのインスタンス 'app' をそのままimportします
# Vercelはこの 'app' 変数を自動的に検出し、ASGIアプリとして起動します
try:
    logger.info("Attempting to import api.main...")
    # Import app directly - Vercel will detect and start it
    from api.main import app
    logger.info("Successfully imported FastAPI app")
    logger.info(f"FastAPI app type: {type(app)}")
    logger.info("App ready for Vercel to start")
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

# Ensure app is available at module level for Vercel
# Vercel looks for 'app' variable in the module
__all__ = ["app"]

# Export app for Vercel
# Vercel automatically detects the 'app' variable and starts it as an ASGI application
# DO NOT define a 'handler' variable - this causes Vercel to use the old HTTP handler mode
__all__ = ["app"]
