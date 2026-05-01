from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class RegistrationCreate(BaseModel):
    eventId: str = Field(...)
    name: str = Field(...)
    email: EmailStr = Field(...)


class RegistrationOut(BaseModel):
    id: str
    eventId: str
    name: str
    email: EmailStr
    registeredAt: datetime

    class Config:
        orm_mode = True
