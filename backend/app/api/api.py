from fastapi import APIRouter
from app.api.endpoints import events, alerts, settings, simulation

api_router = APIRouter()
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(simulation.router, prefix="/simulation", tags=["simulation"])
