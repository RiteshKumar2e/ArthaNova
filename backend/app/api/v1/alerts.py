"""ArthaNova — Alerts API router."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, Alert
from app.schemas.schemas import AlertCreate, AlertResponse, MessageResponse

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])


@router.get("/", response_model=List[AlertResponse])
async def get_alerts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Alert).where(Alert.user_id == current_user.id).order_by(Alert.created_at.desc()))
    return result.scalars().all()


@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    data: AlertCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    alert = Alert(user_id=current_user.id, **data.model_dump())
    db.add(alert)
    await db.flush()
    return alert


@router.put("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: int,
    data: AlertCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Alert).where(Alert.id == alert_id, Alert.user_id == current_user.id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    for field, value in data.model_dump().items():
        setattr(alert, field, value)
    await db.flush()
    return alert


@router.delete("/{alert_id}", response_model=MessageResponse)
async def delete_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Alert).where(Alert.id == alert_id, Alert.user_id == current_user.id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    await db.delete(alert)
    return MessageResponse(message="Alert deleted")
