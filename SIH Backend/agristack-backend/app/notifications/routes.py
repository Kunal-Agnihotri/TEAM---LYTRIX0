from fastapi import APIRouter, Depends

from app.auth.models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/")
async def list_notifications(user: User = Depends(get_current_user)):
    return []
