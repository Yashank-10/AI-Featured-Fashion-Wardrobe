from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    body_shape: Optional[str]
    height: Optional[float]
    weight: Optional[float]
    undertone: Optional[str]
    style_preferences: Optional[str]
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    body_shape: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    undertone: Optional[str] = None
    style_preferences: Optional[str] = None
