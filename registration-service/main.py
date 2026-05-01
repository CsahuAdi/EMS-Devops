from fastapi import FastAPI
from routes.registrations import router as registrations_router
from database import connect_to_mongo, close_mongo_connection

app = FastAPI()

app.include_router(registrations_router)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=5002, reload=True)
