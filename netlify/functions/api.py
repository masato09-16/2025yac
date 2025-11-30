"""
Netlify Functions handler for FastAPI application
"""
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from mangum import Mangum
from api.main import app

# Create Mangum handler for AWS Lambda/Netlify Functions
handler = Mangum(app, lifespan="off")

