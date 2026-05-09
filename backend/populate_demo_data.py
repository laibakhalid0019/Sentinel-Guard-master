"""
Quick script to populate the database with demo data
"""
from app.db.session import SessionLocal
from app.db.models import Event, Alert
from datetime import datetime, timedelta
import random

db = SessionLocal()

# Clear existing data
db.query(Event).delete()
db.query(Alert).delete()
db.commit()

print("Creating demo events...")

# Create 20 sample events
event_types = ["modified", "created", "deleted"]
file_paths = [
    "C:/Users/Test/Documents/report.docx",
    "C:/Users/Test/Downloads/installer.exe",
    "C:/Users/Test/Pictures/photo.jpg",
    "C:/Users/Test/Desktop/project.xlsx",
    "C:/Users/Test/Videos/demo.mp4",
]

for i in range(20):
    is_suspicious = random.random() < 0.3  # 30% suspicious
    event = Event(
        file_path=random.choice(file_paths),
        event_type=random.choice(event_types),
        is_suspicious=is_suspicious,
        details={
            "entropy": round(random.uniform(3.5, 7.9), 2),
            "burst_count": random.randint(1, 80),
            "ml_probability": round(random.uniform(0.1, 0.95), 2) if is_suspicious else round(random.uniform(0.0, 0.3), 2),
            "reasons": ["High Entropy", "Write Burst"] if is_suspicious else []
        },
        timestamp=datetime.now() - timedelta(hours=random.randint(0, 12))
    )
    db.add(event)

print("Creating demo alerts...")

# Create 5 sample alerts
severities = ["low", "medium", "high"]
messages = [
    "Suspicious file modification detected",
    "Potential ransomware activity: Multiple files encrypted",
    "High entropy file created",
    "Rapid file modifications detected",
    "Malware signature found in file",
]

for i in range(5):
    alert = Alert(
        severity=random.choice(severities),
        message=random.choice(messages),
        status="active" if random.random() < 0.5 else "resolved",
        timestamp=datetime.now() - timedelta(hours=random.randint(0, 24))
    )
    db.add(alert)

db.commit()
db.close()

print("✅ Demo data created successfully!")
print("Refresh your dashboard now!")
