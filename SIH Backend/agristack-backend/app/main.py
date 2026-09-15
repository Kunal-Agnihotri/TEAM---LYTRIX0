from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.assistant.routes import router as assistant_router
from app.auth.routes import router as auth_router
from app.db.mongo import init_db
from app.marketplace.routes import router as marketplace_router
from app.notifications.routes import router as notifications_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="AgriStack API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(marketplace_router)
app.include_router(assistant_router)
app.include_router(notifications_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
