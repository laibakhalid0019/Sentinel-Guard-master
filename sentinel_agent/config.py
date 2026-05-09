import os

class Config:
    BACKEND_URL = "http://localhost:8000/api/v1"
    
    # Get the project root directory (one level up from sentinel_agent)
    PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    MONITORED_PATHS = [
        # Watch the simulation sandbox directory
        os.path.join(PROJECT_ROOT, "simulation", "sandbox_test"),
    ]
    QUARANTINE_DIR = os.path.expanduser("~/SentinelGuard/Quarantine")
    BACKUP_DIR = os.path.expanduser("~/SentinelGuard/Backups")
    
    # Thresholds
    ENTROPY_THRESHOLD = 7.5
    WRITE_BURST_THRESHOLD = 10 # files per second

config = Config()

# Ensure dirs exist
os.makedirs(config.QUARANTINE_DIR, exist_ok=True)
os.makedirs(config.BACKUP_DIR, exist_ok=True)
# Ensure test monitor dir exists for demo
os.makedirs(config.MONITORED_PATHS[0], exist_ok=True)
