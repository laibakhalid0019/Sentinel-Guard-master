import os
import shutil
import psutil
import logging
import time
from config import config

logger = logging.getLogger(__name__)

def kill_suspicious_process(file_path):
    # This is a simplified implementation. 
    # In a real kernel-level driver, we would know exactly which PID caused the event.
    # Here, we scan for processes accessing the file or known bad process names.
    
    target_process_names = ["ransomware_sim.exe", "python.exe"] # Be careful with python.exe!
    
    for proc in psutil.process_iter(['pid', 'name', 'open_files']):
        try:
            # Check if process has the file open
            if proc.info['open_files']:
                for f in proc.info['open_files']:
                    if f.path == file_path:
                        logger.info(f"Killing process {proc.info['name']} (PID: {proc.info['pid']}) accessing {file_path}")
                        proc.kill()
                        return
            
            # Heuristic: If we can't find open file (it might have closed it already),
            # look for the simulator script if it's running.
            # This is specific for the demo.
            if "python" in proc.info['name']:
                # Check cmdline to see if it's the simulator
                if any("ransomware_sim" in arg for arg in proc.cmdline()):
                     logger.info(f"Killing Simulator (PID: {proc.info['pid']})")
                     proc.kill()
                     return

        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

def quarantine_file(file_path):
    try:
        if not os.path.exists(file_path):
            return
            
        filename = os.path.basename(file_path)
        dest = os.path.join(config.QUARANTINE_DIR, f"{filename}_{int(time.time())}.quarantine")
        shutil.move(file_path, dest)
        logger.info(f"Quarantined {file_path} to {dest}")

        # Notify Backend
        try:
            import requests
            payload = {
                "filename": filename,
                "original_path": file_path,
                "quarantine_path": dest,
                "reason": "Suspicious Activity Detected" 
            }
            # Use BACKEND_URL from config
            requests.post(f"{config.BACKEND_URL}/quarantine/", json=payload)
        except Exception as api_err:
            logger.error(f"Failed to notify backend about quarantine: {api_err}")

    except Exception as e:
        logger.error(f"Failed to quarantine {file_path}: {e}")

def restore_backup(file_path):
    # Placeholder for backup restoration logic
    # In a real app, we'd look up the latest clean version in config.BACKUP_DIR
    pass

def trigger_defense(file_path, reasons):
    logger.info("Initiating Defense Protocols...")
    
    # 1. Kill Process
    kill_suspicious_process(file_path)
    
    # 2. Quarantine File
    quarantine_file(file_path)
    
    # 3. Restore (Optional)
    restore_backup(file_path)
