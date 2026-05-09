from fastapi import APIRouter, HTTPException
import subprocess
import os
import threading

router = APIRouter()

def run_simulation_script():
    try:
        # Get the project root (3 levels up from this file: backend/app/api/endpoints)
        current_file = os.path.abspath(__file__)
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_file))))
        project_root = os.path.dirname(backend_dir)
        script_path = os.path.join(project_root, "simulation", "ransomware_sim.py")
        
        if not os.path.exists(script_path):
            print(f"Error: Simulation script not found at {script_path}")
            return

        # Run with --auto flag to skip input prompt
        subprocess.run(["python", script_path, "--auto"], check=True, cwd=project_root)
    except Exception as e:
        print(f"Error running simulation: {e}")

@router.post("/start")
def start_simulation():
    try:
        # Run in a separate thread to not block the API
        thread = threading.Thread(target=run_simulation_script)
        thread.start()
        return {"status": "started", "message": "Simulation started in background"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

