from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.db.base_class import Base
from app.db import models # Import models to register them

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

from app.api.endpoints import events, alerts, simulation, settings, quarantine

app.include_router(events.router, prefix="/api/v1/events", tags=["events"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(simulation.router, prefix="/api/v1/simulation", tags=["simulation"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(quarantine.router, prefix="/api/v1/quarantine", tags=["quarantine"])

@app.on_event("startup")
def init_tables():
    from app.db.base_class import Base
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "SentinelGuard Backend is Running", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
