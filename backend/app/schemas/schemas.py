from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    persona: Optional[str] = "investor"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ArticleResponse(BaseModel):
    id: int
    title: str
    summary: str
    category: str
    source: str
    sentiment_score: float
    impact_score: str
    persona_tags: str
    published_at: datetime
    class Config:
        from_attributes = True

class StoryEventResponse(BaseModel):
    id: int
    title: str
    description: str
    sentiment: float
    event_date: datetime
    class Config:
        from_attributes = True

class StoryArcResponse(BaseModel):
    id: int
    title: str
    description: str
    key_players: List[dict]
    status: str
    prediction: str
    events: List[StoryEventResponse] = []
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
