from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import get_db
from app.db.models import Event

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = db.query(Event).order_by(Event.timestamp.desc()).offset(skip).limit(limit).all()
    return [
        {
            "id": e.id,
            "timestamp": e.timestamp,
            "file_path": e.file_path,
            "event_type": e.event_type,
            "is_suspicious": e.is_suspicious,
            "details": e.details
        }
        for e in events
    ]

@router.post("/", response_model=dict)
def create_event(event_data: dict, db: Session = Depends(get_db)):
    new_event = Event(
        file_path=event_data.get("file_path"),
        event_type=event_data.get("event_type"),
        is_suspicious=event_data.get("is_suspicious", False),
        details=event_data.get("details", {})
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return {"id": new_event.id, "status": "created"}
