"""ArthaNova — User profile API router."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user, get_current_active_admin
from app.models.user import User
from app.schemas.schemas import UserResponse, UserUpdateRequest, MessageResponse

router = APIRouter(prefix="/users", tags=["User Management"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    await db.flush()
    return current_user


@router.get("/", response_model=list)
async def list_users(
    page: int = 1,
    per_page: int = 20,
    admin_user: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin: list all users."""
    result = await db.execute(select(User).offset((page - 1) * per_page).limit(per_page))
    users = result.scalars().all()
    return [
        {
            "id": u.id, "email": u.email, "username": u.username,
            "full_name": u.full_name, "role": u.role, "is_active": u.is_active,
            "created_at": u.created_at, "last_login": u.last_login,
        }
        for u in users
    ]


@router.delete("/{user_id}", response_model=MessageResponse)
async def deactivate_user(
    user_id: int,
    admin_user: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin: deactivate a user account."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False  # type: ignore
    await db.flush()
    return MessageResponse(message=f"User {user.email} deactivated")
