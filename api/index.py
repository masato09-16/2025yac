"""
Vercel Functions handler for FastAPI application
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path
# Try multiple possible paths for Vercel deployment
current_file = Path(__file__).resolve()
possible_backend_paths = [
    current_file.parent.parent / "backend",  # Standard structure
    current_file.parent / "backend",  # If backend is in api/
    Path("/var/task/backend"),  # Vercel function environment
    Path(os.getcwd()) / "backend",  # Current working directory
]

backend_dir = None
for path in possible_backend_paths:
    if path.exists() and (path / "api").exists():
        backend_dir = path
        break

if backend_dir:
    sys.path.insert(0, str(backend_dir))
    os.chdir(str(backend_dir))  # Change working directory to backend
else:
    # Fallback: try to find backend in current path
    import os
    cwd = os.getcwd()
    if "backend" in cwd:
        sys.path.insert(0, cwd)
    else:
        # Last resort: add current directory
        sys.path.insert(0, str(Path(__file__).parent.parent))

from mangum import Mangum
from api.main import app

# Create Mangum handler for Vercel Functions
handler = Mangum(app, lifespan="off")

