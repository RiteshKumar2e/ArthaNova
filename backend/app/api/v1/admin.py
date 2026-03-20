"""ArthaNova — Admin management API router."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.core.dependencies import get_db, get_current_active_admin
from app.models.user import User, UserRole
from app.schemas.schemas import MessageResponse

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/dashboard/stats")
async def get_admin_stats(
    admin_user: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get high-level system overview stats."""
    # Count total users
    user_count_query = select(func.count(User.id))
    user_count_result = await db.execute(user_count_query)
    total_users = user_count_result.scalar()

    # Count active users
    active_count_query = select(func.count(User.id)).where(User.is_active == True)
    active_count_result = await db.execute(active_count_query)
    active_users = active_count_result.scalar()

    # Placeholder stats for other modules
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "new_today": 5, # Mock
            "growth_pct": 12.5
        },
        "system": {
            "uptime": "99.99%",
            "cpu_usage": "14%",
            "memory_usage": "45%",
            "api_requests_24h": 12450
        },
        "alerts": {
            "ai_signals_generated": 142,
            "critical_errors": 0,
            "pending_notifications": 12
        },
        "content": {
            "news_updates": 48,
            "ai_insights": 156
        }
    }

@router.get("/users", response_model=List[Dict[str, Any]])
async def list_all_users_extended(
    page: int = 1,
    per_page: int = 50,
    admin_user: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db)
):
    """Detailed user list for management."""
    query = select(User).order_by(desc(User.created_at)).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    users = result.scalars().all()
    
    return [
        {
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "is_verified": u.is_verified,
            "created_at": u.created_at,
            "last_login": u.last_login,
            "risk_profile": u.risk_profile
        }
        for u in users
    ]

@router.patch("/users/{user_id}/toggle-status")
async def toggle_user_status(
    user_id: int,
    admin_user: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db)
):
    """Activate or deactivate a user."""
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not bool(user.is_active)  # type: ignore
    await db.flush()
    
    status_str = "activated" if bool(user.is_active) else "deactivated"
    return {"message": f"User {user.email} has been {status_str}", "is_active": bool(user.is_active)}

@router.get("/logs/audit")
async def get_audit_logs(
    limit: int = 100,
    admin_user: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get system audit logs (Mocked for now)."""
    return [
        {
            "id": i,
            "timestamp": (datetime.now() - timedelta(minutes=i*15)).isoformat(),
            "user": "admin_main",
            "action": "USER_UPDATE",
            "details": f"Updated role for user ID {100+i}",
            "ip": "192.168.1.1"
        }
        for i in range(1, 21)
    ]

@router.get("/ai/status")
async def get_ai_model_status(
    admin_user: User = Depends(get_current_active_admin)
):
    """Monitor AI modules status."""
    return {
        "models": [
            {"name": "Sentiment Engine", "status": "online", "version": "v2.4", "latency": "120ms"},
            {"name": "Technical Pattern Recognizer", "status": "online", "version": "v1.8", "latency": "450ms"},
            {"name": "News Aggregator", "status": "online", "version": "v3.1", "latency": "800ms"},
            {"name": "Portfolio Risk AI", "status": "maintenance", "version": "v1.2", "latency": "N/A"}
        ],
        "last_training": datetime.now().isoformat(),
        "queue_size": 14
    }

@router.get("/video/pipelines")
async def get_video_engine_status(
    admin_user: User = Depends(get_current_active_admin)
):
    """Monitor video generation pipelines."""
    return {
        "active_jobs": 3,
        "completed_today": 45,
        "failed_today": 2,
        "pipelines": [
            {"id": "p-1", "name": "Daily Market Summary", "status": "idle"},
            {"id": "p-2", "name": "Stock Deep Dive", "status": "processing", "progress": 65},
            {"id": "p-3", "name": "Alert Triggered Video", "status": "waiting"}
        ]
    }
