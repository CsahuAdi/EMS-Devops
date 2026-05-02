import os
from dotenv import load_dotenv
load_dotenv()
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://localhost:27017/registrations_db"
)

client = AsyncIOMotorClient(MONGODB_URI)
db = client["registrations_db"]

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client["registrations_db"]
    # ensure unique index on eventId+email
    await db.registrations.create_index([("eventId", 1), ("email", 1)], unique=True)


async def close_mongo_connection():
    global client
    if client:
        client.close()
