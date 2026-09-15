from fastapi import HTTPException, status

from app.auth.models import User
from app.auth.schemas import LoginRequest, RegisterRequest
from app.core.security import create_access_token, hash_password, verify_password


async def register_user(data: RegisterRequest) -> User:
    existing = await User.find_one(User.email == data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=data.role,
        phone=data.phone,
    )
    await user.insert()
    return user


async def authenticate_user(data: LoginRequest) -> str:
    user = await User.find_one(User.email == data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return token
