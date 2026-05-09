from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Alert

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_alerts(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).offset(skip).limit(limit).all()
    return [
        {
            "id": a.id,
            "timestamp": a.timestamp,
            "severity": a.severity,
            "message": a.message,
            "status": a.status,
            "related_event_id": a.related_event_id
        }
        for a in alerts
    ]
