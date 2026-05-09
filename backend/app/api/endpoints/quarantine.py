from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import os
import json
import shutil
import glob

router = APIRouter()

# Configuration (Should match Agent config ideally, or be passed in)
QUARANTINE_DIR = os.path.expanduser("~/SentinelGuard/Quarantine")
METADATA_DIR = os.path.join(QUARANTINE_DIR, ".metadata")

# Ensure dirs exist
os.makedirs(QUARANTINE_DIR, exist_ok=True)
os.makedirs(METADATA_DIR, exist_ok=True)

class QuarantineCreate(BaseModel):
    filename: str
    original_path: str
    quarantine_path: str
    reason: str

class QuarantineItem(BaseModel):
    id: str
    filename: str
    original_path: str
    quarantine_path: str
    timestamp: str
    reason: str
    status: str

@router.get("/", response_model=List[QuarantineItem])
def get_quarantined_files():
    files = []
    # Scan metadata directory for JSON files using os.listdir (more reliable on Windows)
    try:
        if os.path.exists(METADATA_DIR):
            for filename in os.listdir(METADATA_DIR):
                if filename.endswith('.json'):
                    meta_file = os.path.join(METADATA_DIR, filename)
                    try:
                        with open(meta_file, "r") as f:
                            data = json.load(f)
                            # Always include the file, even if physical file is missing
                            # (This helps debug and shows what the system tracked)
                            files.append(data)
                    except Exception as e:
                        print(f"Error reading metadata {meta_file}: {e}")
    except Exception as e:
        print(f"Error scanning metadata directory: {e}")
    
    # Sort by timestamp desc
    files.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return files

@router.post("/", response_model=QuarantineItem)
def quarantine_file(file: QuarantineCreate):
    # Generate a unique ID (using timestamp for simplicity)
    file_id = str(int(datetime.now().timestamp() * 1000))
    
    item = {
        "id": file_id,
        "filename": file.filename,
        "original_path": file.original_path,
        "quarantine_path": file.quarantine_path,
        "timestamp": datetime.now().isoformat(),
        "reason": file.reason,
        "status": "quarantined"
    }
    
    # Save metadata
    meta_path = os.path.join(METADATA_DIR, f"{file_id}.json")
    with open(meta_path, "w") as f:
        json.dump(item, f, indent=4)
        
    return item

@router.post("/{file_id}/restore")
def restore_file(file_id: str):
    meta_path = os.path.join(METADATA_DIR, f"{file_id}.json")
    if not os.path.exists(meta_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        with open(meta_path, "r") as f:
            data = json.load(f)
            
        quarantine_path = data["quarantine_path"]
        original_path = data["original_path"]
        
        if os.path.exists(quarantine_path):
            os.makedirs(os.path.dirname(original_path), exist_ok=True)
            shutil.move(quarantine_path, original_path)
            
            # Remove metadata after restore
            os.remove(meta_path)
            return {"status": "restored", "path": original_path}
        else:
            # File missing, maybe delete metadata?
            os.remove(meta_path)
            raise HTTPException(status_code=404, detail="Physical file missing")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{file_id}")
def delete_quarantined_file(file_id: str):
    meta_path = os.path.join(METADATA_DIR, f"{file_id}.json")
    if not os.path.exists(meta_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        with open(meta_path, "r") as f:
            data = json.load(f)
            
        quarantine_path = data["quarantine_path"]
        
        if os.path.exists(quarantine_path):
            os.remove(quarantine_path)
            
        # Remove metadata
        os.remove(meta_path)
        return {"status": "deleted"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
