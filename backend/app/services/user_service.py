"""ArthaNova — User service layer."""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.models.user import User, Portfolio
from app.core.security import get_password_hash, verify_password
from app.schemas.schemas import UserRegisterRequest


async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, data: UserRegisterRequest) -> User:
    user = User(
        email=data.email,
        username=data.username,
        full_name=data.full_name,
        phone=data.phone,
        hashed_password=get_password_hash(data.password),
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    await db.flush()

    # Create default portfolio
    portfolio = Portfolio(user_id=user.id, name=f"{data.full_name}'s Portfolio")
    db.add(portfolio)
    await db.flush()

    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def update_last_login(db: AsyncSession, user: User):
    user.last_login = datetime.now(timezone.utc)
    await db.flush()


async def update_user_password(db: AsyncSession, user: User, new_password: str):
    user.hashed_password = get_password_hash(new_password)
    await db.flush()
