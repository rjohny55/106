from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
