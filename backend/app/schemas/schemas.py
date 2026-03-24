"""ArthaNova — Pydantic schemas for request/response validation."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_]+$')
    full_name: str = Field(..., min_length=2, max_length=200)
    password: str = Field(..., min_length=8, max_length=100)
    phone: Optional[str] = None

    @validator("password")
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


# ─── User Schemas ──────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    risk_profile: str
    is_active: bool
    is_verified: bool
    is_admin: bool
    theme: str
    notification_email: bool
    notification_push: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    risk_profile: Optional[str] = None
    theme: Optional[str] = None
    notification_email: Optional[bool] = None
    notification_push: Optional[bool] = None


# ─── Portfolio Schemas ─────────────────────────────────────────────────────────

class HoldingCreate(BaseModel):
    symbol: str = Field(..., min_length=1, max_length=20)
    company_name: str
    quantity: float = Field(..., gt=0)
    avg_buy_price: float = Field(..., gt=0)
    sector: Optional[str] = None
    exchange: str = "NSE"


class HoldingResponse(BaseModel):
    id: int
    symbol: str
    company_name: str
    quantity: float
    avg_buy_price: float
    current_price: Optional[float]
    sector: Optional[str]
    exchange: str
    invested_value: float = 0
    current_value: float = 0
    pnl: float = 0
    pnl_pct: float = 0

    class Config:
        from_attributes = True


class PortfolioResponse(BaseModel):
    id: int
    name: str
    total_invested: float
    current_value: float
    total_pnl: float
    risk_score: Optional[float]
    holdings: List[HoldingResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Watchlist Schemas ─────────────────────────────────────────────────────────

class WatchlistCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class WatchlistItemAdd(BaseModel):
    symbol: str
    company_name: str


class WatchlistResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_default: bool
    items: List[dict] = []
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Alert Schemas ─────────────────────────────────────────────────────────────

class AlertCreate(BaseModel):
    symbol: Optional[str] = None
    alert_type: str  # price, volume, news, ai_signal
    condition: str   # above, below, change_pct
    target_value: Optional[float] = None
    message: Optional[str] = None


class AlertResponse(BaseModel):
    id: int
    symbol: Optional[str]
    alert_type: str
    condition: str
    target_value: Optional[float]
    message: Optional[str]
    is_active: bool
    is_triggered: bool
    triggered_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Chat Schemas ──────────────────────────────────────────────────────────────

class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[int] = None
    include_portfolio: bool = True


class ChatMessageResponse(BaseModel):
    session_id: int
    message_id: int
    role: str
    content: str
    sources: Optional[List[dict]] = None
    created_at: datetime


class ChatSessionResponse(BaseModel):
    id: int
    title: Optional[str]
    message_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── Backtest Schemas ──────────────────────────────────────────────────────────

class BacktestRequest(BaseModel):
    symbol: str
    strategy_name: str
    start_date: str
    end_date: str
    initial_capital: float = Field(..., gt=0, le=10000000)
    parameters: Optional[dict] = None


class BacktestResponse(BaseModel):
    id: int
    strategy_name: str
    symbol: str
    initial_capital: float
    final_value: float
    total_return_pct: float
    max_drawdown_pct: float
    sharpe_ratio: Optional[float]
    total_trades: int
    parameters: Optional[dict]
    trade_log: Optional[List[dict]]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Generic Schemas ───────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    success: bool = True


class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    per_page: int = Field(20, ge=1, le=100)


class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    per_page: int
    total_pages: int
class NotificationResponse(BaseModel):
    id: int
    user_id: Optional[int]
    type: str
    title: str
    message: str
    is_read: bool
    data: Optional[dict]
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationCreate(BaseModel):
    user_id: Optional[int] = None
    type: str = "info"
    title: str
    message: str
    data: Optional[dict] = None
