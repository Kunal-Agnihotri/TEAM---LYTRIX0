from datetime import datetime, timezone
from enum import Enum

from beanie import Document, Link
from pydantic import Field

from app.auth.models import User


class ListingCategory(str, Enum):
    grain = "grain"
    dairy = "dairy"
    livestock = "livestock"
    produce = "produce"
    other = "other"


class OrderStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class Listing(Document):
    seller: Link[User]
    title: str
    category: ListingCategory
    description: str | None = None
    quantity: float
    unit: str
    price_per_unit: float
    attributes: dict = Field(default_factory=dict)
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "listings"


class Order(Document):
    buyer: Link[User]
    listing: Link[Listing]
    quantity: float
    total_price: float
    status: OrderStatus = OrderStatus.pending
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "orders"
