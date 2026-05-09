from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base

class Event(Base):
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    file_path = Column(String, index=True)
    event_type = Column(String)  # created, modified, deleted, moved
    is_suspicious = Column(Boolean, default=False)
    details = Column(JSON)  # Store extra info like entropy, size change

class Alert(Base):
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    severity = Column(String)  # low, medium, high, critical
    message = Column(String)
    status = Column(String, default="new")  # new, resolved
    related_event_id = Column(Integer, nullable=True)

class MonitoredPath(Base):
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SystemLog(Base):
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    level = Column(String)
    message = Column(String)
