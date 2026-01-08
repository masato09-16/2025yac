import sys
import os
from pathlib import Path

# Simulate Vercel environment
# Vercel adds the project root to path implicitly or explicitly depending on config
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

print(f"Project root: {project_root}")
print(f"System path: {sys.path[:3]}...")

# Set dummy environment variables to pass config validation
os.environ["SECRET_KEY"] = "dummy_secret_key_for_testing_purposes_only_12345"
os.environ["DATABASE_URL"] = "postgresql://user:pass@localhost:5432/db"

try:
    print("Attempting to import api.index...")
    # This simulates what Vercel does when loading api/index.py
    import api.index
    print("✅ Success: Imported api.index")
    
    print("Attempting to access app...")
    app = api.index.app
    print(f"✅ Success: Found app object: {type(app)}")
    
except ImportError as e:
    print(f"❌ ImportError: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"❌ Unexpected Error: {e}")
    import traceback
    traceback.print_exc()
