from fastapi import FastAPI
from app.core.db import client

app = FastAPI()

@app.on_event("startup")
async def startup_db_check():
    try:
        await client.admin.command("ping")
        print("MongoDB connected successfully")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}