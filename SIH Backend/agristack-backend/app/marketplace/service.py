from beanie import PydanticObjectId
from fastapi import HTTPException, status

from app.auth.models import User
from app.marketplace.models import Listing, Order
from app.marketplace.schemas import ListingCreate, OrderCreate


async def create_listing(seller: User, data: ListingCreate) -> Listing:
    listing = Listing(seller=seller, **data.model_dump())
    await listing.insert()
    return listing


async def get_active_listings(category: str | None = None) -> list[Listing]:
    query = Listing.find(Listing.is_active == True)
    if category:
        query = query.find(Listing.category == category)
    return await query.to_list()


async def get_listing(listing_id: str) -> Listing:
    listing = await Listing.get(PydanticObjectId(listing_id))
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return listing


async def place_order(buyer: User, data: OrderCreate) -> Order:
    listing = await get_listing(data.listing_id)
    if not listing.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Listing not active")
    if data.quantity > listing.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient quantity")

    listing.quantity -= data.quantity
    if listing.quantity == 0:
        listing.is_active = False
    await listing.save()

    order = Order(
        buyer=buyer,
        listing=listing,
        quantity=data.quantity,
        total_price=data.quantity * listing.price_per_unit,
    )
    await order.insert()
    return order


async def get_orders_for_user(user: User) -> list[Order]:
    return await Order.find(Order.buyer.id == user.id).to_list()
