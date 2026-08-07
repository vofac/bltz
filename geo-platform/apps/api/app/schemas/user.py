import uuid

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=150)
    company_name: str = Field(min_length=1, max_length=200)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str | None
    role: UserRole
    company_id: uuid.UUID | None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
