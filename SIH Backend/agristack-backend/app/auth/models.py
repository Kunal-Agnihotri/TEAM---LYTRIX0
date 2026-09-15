from datetime import datetime, timezone
from enum import Enum

from beanie import Document
from pydantic import EmailStr, Field


class Role(str, Enum):
    farmer = "farmer"
    buyer = "buyer"
    admin = "admin"


class User(Document):
    email: EmailStr
    hashed_password: str
    full_name: str
    role: Role
    phone: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
