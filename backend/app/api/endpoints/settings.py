from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import MonitoredPath
import os
import json

router = APIRouter()

@router.get("/paths", response_model=List[dict])
def get_monitored_paths(db: Session = Depends(get_db)):
    paths = db.query(MonitoredPath).all()
    return [{"id": p.id, "path": p.path, "is_active": p.is_active} for p in paths]

@router.post("/paths", response_model=dict)
def add_monitored_path(path: str, db: Session = Depends(get_db)):
    existing = db.query(MonitoredPath).filter(MonitoredPath.path == path).first()
    if existing:
        raise HTTPException(status_code=400, detail="Path already monitored")
    
    new_path = MonitoredPath(path=path)
    db.add(new_path)
    db.commit()
    db.refresh(new_path)
    return {"id": new_path.id, "path": new_path.path, "status": "added"}

@router.delete("/paths/{path_id}")
def remove_monitored_path(path_id: int, db: Session = Depends(get_db)):
    path_obj = db.query(MonitoredPath).filter(MonitoredPath.id == path_id).first()
    if not path_obj:
        raise HTTPException(status_code=404, detail="Path not found")
    
    db.delete(path_obj)
    db.commit()
    return {"status": "deleted"}
    db.delete(path_obj)
    db.commit()
    return {"status": "deleted"}

CONFIG_FILE = "config.json"

@router.get("/config", response_model=dict)
def get_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                return json.load(f)
        except:
            pass
    return {}

@router.post("/config", response_model=dict)
def update_config(config: dict):
    # Load existing to merge
    current_config = {}
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                current_config = json.load(f)
        except:
            pass
            
    current_config.update(config)
    
    with open(CONFIG_FILE, "w") as f:
        json.dump(current_config, f, indent=4)
        
    return {"status": "updated"}
