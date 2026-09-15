from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.assistant.service import query_assistant
from app.auth.models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/assistant", tags=["assistant"])


class AssistantQuery(BaseModel):
    text: str
    language: str = "en"


@router.post("/query")
async def ask_assistant(data: AssistantQuery, user: User = Depends(get_current_user)):
    return await query_assistant(data.text, data.language, str(user.id))
