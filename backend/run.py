import uvicorn
import sys
import os

# Get the directory containing this file (backend directory)
backend_dir = os.path.dirname(os.path.abspath(__file__))

# Ensure the backend directory is in the path
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    # Get PORT from environment variable (for Railway/production) or default to 8000
    port = int(os.environ.get("PORT", 8000))
    
    # In production, don't use reload
    is_production = os.environ.get("RAILWAY_ENVIRONMENT") or os.environ.get("ENVIRONMENT") == "production"
    
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=not is_production
    )
