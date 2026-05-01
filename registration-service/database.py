import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "registrations_db")

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    # ensure unique index on eventId+email
    await db.registrations.create_index([("eventId", 1), ("email", 1)], unique=True)


async def close_mongo_connection():
    global client
    if client:
        client.close()
