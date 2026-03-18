"""ArthaNova — Auth API router."""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user
from app.core.security import (
    create_access_token, create_refresh_token, decode_token,
    create_password_reset_token, verify_password_reset_token
)
from app.schemas.schemas import (
    UserRegisterRequest, UserLoginRequest, TokenResponse,
    RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest,
    ChangePasswordRequest, UserResponse, MessageResponse
)
from app.services.user_service import (
    create_user, authenticate_user, get_user_by_email,
    get_user_by_username, update_last_login, update_user_password
)
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    if await get_user_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if await get_user_by_username(db, data.username):
        raise HTTPException(status_code=400, detail="Username already taken")

    user = await create_user(db, data)
    token_data = {"sub": str(user.id), "email": user.email}

    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        token_type="bearer",
        expires_in=3600,
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate and get JWT tokens."""
    user = await authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    await update_last_login(db, user)
    token_data = {"sub": str(user.id), "email": user.email}

    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        token_type="bearer",
        expires_in=3600,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token using a valid refresh token."""
    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = await get_user_by_email(db, payload.get("email", ""))
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    token_data = {"sub": str(user.id), "email": user.email}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        token_type="bearer",
        expires_in=3600,
    )


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Send password reset email."""
    user = await get_user_by_email(db, data.email)
    # Always return success to prevent email enumeration
    if user:
        token = create_password_reset_token(data.email)
        # In production: send email with reset link
        # await send_password_reset_email(user.email, token)
    return MessageResponse(message="If that email exists, a reset link has been sent.")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset password using token from email."""
    email = verify_password_reset_token(data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await update_user_password(db, user, data.new_password)
    return MessageResponse(message="Password reset successfully")


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change password for authenticated user."""
    from app.core.security import verify_password
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await update_user_password(db, current_user, data.new_password)
    return MessageResponse(message="Password changed successfully")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user)):
    """Logout (client should discard tokens)."""
    return MessageResponse(message="Logged out successfully")
