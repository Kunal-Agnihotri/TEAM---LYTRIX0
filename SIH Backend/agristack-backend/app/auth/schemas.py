from pydantic import BaseModel, EmailStr

from app.auth.models import Role


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Role
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: Role
    phone: str | None = None
