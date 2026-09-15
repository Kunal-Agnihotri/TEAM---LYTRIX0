import httpx

from app.core.config import settings

VOICE_SERVICE_URL = "http://localhost:8100"


async def query_assistant(text: str, language: str, user_id: str) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{VOICE_SERVICE_URL}/query",
            json={"text": text, "language": language, "user_id": user_id},
        )
        response.raise_for_status()
        return response.json()
