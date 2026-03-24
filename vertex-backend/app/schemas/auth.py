from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    email: str | None = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str | None = None
    email: EmailStr
    plan: str | None = "free"
    interactions_limit: int | None = 0
    interactions_used: int | None = 0
    is_active: bool | None = True
    is_admin: bool | None = False
