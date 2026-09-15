from fastapi import APIRouter, Depends

from app.auth.models import User
from app.core.deps import get_current_user
from app.marketplace.schemas import (
    ListingCreate,
    ListingResponse,
    OrderCreate,
    OrderResponse,
)
from app.marketplace.service import (
    create_listing,
    get_active_listings,
    get_orders_for_user,
    place_order,
)

router = APIRouter(prefix="/marketplace", tags=["marketplace"])


@router.post("/listings", response_model=ListingResponse)
async def add_listing(data: ListingCreate, user: User = Depends(get_current_user)):
    listing = await create_listing(user, data)
    return ListingResponse(
        id=str(listing.id),
        seller_id=str(user.id),
        title=listing.title,
        category=listing.category,
        description=listing.description,
        quantity=listing.quantity,
        unit=listing.unit,
        price_per_unit=listing.price_per_unit,
        attributes=listing.attributes,
        is_active=listing.is_active,
    )


@router.get("/listings", response_model=list[ListingResponse])
async def list_listings(category: str | None = None):
    listings = await get_active_listings(category)
    return [
        ListingResponse(
            id=str(l.id),
            seller_id=str(l.seller.ref.id),
            title=l.title,
            category=l.category,
            description=l.description,
            quantity=l.quantity,
            unit=l.unit,
            price_per_unit=l.price_per_unit,
            attributes=l.attributes,
            is_active=l.is_active,
        )
        for l in listings
    ]


@router.post("/orders", response_model=OrderResponse)
async def create_order(data: OrderCreate, user: User = Depends(get_current_user)):
    order = await place_order(user, data)
    return OrderResponse(
        id=str(order.id),
        buyer_id=str(user.id),
        listing_id=str(order.listing.ref.id),
        quantity=order.quantity,
        total_price=order.total_price,
        status=order.status,
    )


@router.get("/orders", response_model=list[OrderResponse])
async def my_orders(user: User = Depends(get_current_user)):
    orders = await get_orders_for_user(user)
    return [
        OrderResponse(
            id=str(o.id),
            buyer_id=str(user.id),
            listing_id=str(o.listing.ref.id),
            quantity=o.quantity,
            total_price=o.total_price,
            status=o.status,
        )
        for o in orders
    ]
