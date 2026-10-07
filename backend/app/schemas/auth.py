from pydantic import BaseModel, EmailStr, Field, ConfigDict
from uuid import UUID

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=120)
    team: str | None = Field(default=None, max_length=120)
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=120)
    
class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    team: str | None
    role: str
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"