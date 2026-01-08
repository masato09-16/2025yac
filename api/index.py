import sys
import os

# Add project root to sys.path (parent of current api directory)
# This allows 'import api.main' to work and resolves relative imports correctly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from api.main import app

# Export app for Vercel
__all__ = ["app"]
