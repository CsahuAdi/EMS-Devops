from typing import List, Optional
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from datetime import datetime


def _serialize(doc: dict) -> dict:
    if not doc:
        return None
    return {
        "id": str(doc.get("_id")),
        "eventId": doc.get("eventId"),
        "name": doc.get("name"),
        "email": doc.get("email"),
        "registeredAt": doc.get("registeredAt"),
    }


async def create_registration(db, registration: dict) -> dict:
    registration_doc = registration.copy()
    registration_doc["registeredAt"] = datetime.utcnow()
    try:
        result = await db.registrations.insert_one(registration_doc)
    except DuplicateKeyError:
        raise
    created = await db.registrations.find_one({"_id": result.inserted_id})
    return _serialize(created)


async def get_all_registrations(db) -> List[dict]:
    cursor = db.registrations.find({})
    items = []
    async for doc in cursor:
        items.append(_serialize(doc))
    return items


async def get_registration_by_id(db, id: str) -> Optional[dict]:
    try:
        oid = ObjectId(id)
    except Exception:
        return None
    doc = await db.registrations.find_one({"_id": oid})
    return _serialize(doc)


async def get_registrations_by_event(db, event_id: str) -> List[dict]:
    cursor = db.registrations.find({"eventId": event_id})
    items = []
    async for doc in cursor:
        items.append(_serialize(doc))
    return items


async def delete_registration(db, id: str) -> bool:
    try:
        oid = ObjectId(id)
    except Exception:
        return False
    result = await db.registrations.delete_one({"_id": oid})
    return result.deleted_count == 1
