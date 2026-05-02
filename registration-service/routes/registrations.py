from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from models import RegistrationCreate, RegistrationOut
import database
import os
from dotenv import load_dotenv
load_dotenv()
import httpx
from crud import (
    create_registration,
    get_all_registrations,
    get_registration_by_id,
    get_registrations_by_event,
    delete_registration,
)
from pymongo.errors import DuplicateKeyError

router = APIRouter()

EVENT_SERVICE_URL = os.getenv("EVENT_SERVICE_URL", "http://192.168.49.2:30500")


@router.get("/health")
async def health():
    return {"status": "Registration service running"}


@router.post("/registrations", status_code=201)
async def post_registration(payload: RegistrationCreate):
    # validate event exists by calling Event service    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{EVENT_SERVICE_URL}/events/{payload.eventId}", timeout=5.0
            )
        except httpx.RequestError:
            return JSONResponse(status_code=400, content={"error": "Invalid eventId"})

    if resp.status_code != 200:
        return JSONResponse(status_code=400, content={"error": "Invalid eventId"})

    reg_doc = payload.dict()

    try:
        created = await create_registration(database.db, reg_doc)  # ✅ changed
    except DuplicateKeyError:
        return JSONResponse(
            status_code=400,
            content={"error": "User already registered for this event"},
        )

    return created


@router.get("/registrations")
async def list_registrations():
    return await get_all_registrations(database.db)  # ✅ changed


@router.get("/registrations/{registration_id}")
async def get_registration(registration_id: str):
    reg = await get_registration_by_id(database.db, registration_id)  # ✅ changed
    if not reg:
        raise HTTPException(status_code=404, detail={"error": "Registration not found"})
    return reg


@router.get("/registrations/event/{event_id}")
async def get_by_event(event_id: str):
    return await get_registrations_by_event(database.db, event_id)  # ✅ changed


@router.delete("/registrations/{registration_id}")
async def delete_registration_route(registration_id: str):
    ok = await delete_registration(database.db, registration_id)  # ✅ changed
    if not ok:
        raise HTTPException(status_code=404, detail={"error": "Registration not found"})
    return {"message": "Registration deleted successfully"}
