from app.marketplace.models import ListingCategory, OrderStatus
from pydantic import BaseModel


class ListingCreate(BaseModel):
    title: str
    category: ListingCategory
    description: str | None = None
    quantity: float
    unit: str
    price_per_unit: float
    attributes: dict = {}


class ListingResponse(BaseModel):
    id: str
    seller_id: str
    title: str
    category: ListingCategory
    description: str | None = None
    quantity: float
    unit: str
    price_per_unit: float
    attributes: dict
    is_active: bool


class OrderCreate(BaseModel):
    listing_id: str
    quantity: float


class OrderResponse(BaseModel):
    id: str
    buyer_id: str
    listing_id: str
    quantity: float
    total_price: float
    status: OrderStatus
