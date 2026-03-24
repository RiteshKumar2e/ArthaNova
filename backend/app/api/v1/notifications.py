"""ArthaNova — Notifications API."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update, or_

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, Notification
from app.schemas.schemas import NotificationResponse, NotificationCreate, MessageResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all notifications for the current user, including global ones."""
    result = await db.execute(
        select(Notification)
        .where(or_(Notification.user_id == current_user.id, Notification.user_id == None))
        .order_by(Notification.created_at.desc())
    )
    notifications = result.scalars().all()
    return notifications


@router.post("/read-all", response_model=MessageResponse)
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark all notifications as read for the current user."""
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .values(is_read=True)
    )
    await db.commit()
    return {"message": "All notifications marked as read", "success": True}


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark a specific notification as read."""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            or_(Notification.user_id == current_user.id, Notification.user_id == None)
        )
    )
    notification = result.scalar_one_or_none()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    await db.commit()
    await db.refresh(notification)
    return notification


@router.delete("/{notification_id}", response_model=MessageResponse)
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a notification."""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
    )
    notification = result.scalar_one_or_none()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    await db.delete(notification)
    await db.commit()
    return {"message": "Notification deleted successfully", "success": True}


# Admin endpoint to send notification
@router.post("/send", response_model=NotificationResponse)
async def send_notification(
    data: NotificationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send a notification (Admin only functionality)."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_notif = Notification(
        user_id=data.user_id,
        type=data.type,
        title=data.title,
        message=data.message,
        data=data.data
    )
    db.add(new_notif)
    await db.commit()
    await db.refresh(new_notif)
    return new_notif


@router.get("/admin/list", response_model=List[NotificationResponse])
async def list_all_notifications_admin(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Admin: Retrieve all notifications in the system."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.execute(
        select(Notification)
        .order_by(Notification.created_at.desc())
    )
    return result.scalars().all()
