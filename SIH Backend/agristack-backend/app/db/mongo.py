from beanie import init_beanie
from pymongo import AsyncMongoClient

from app.core.config import settings
from app.auth.models import User
from app.marketplace.models import Listing, Order

client: AsyncMongoClient | None = None


async def init_db():
    global client
    client = AsyncMongoClient(settings.mongodb_uri)
    await init_beanie(
        database=client[settings.db_name],
        document_models=[User, Listing, Order],
    )
