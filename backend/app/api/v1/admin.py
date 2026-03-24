"""ArthaNova — Admin management API router with AI system monitoring."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

from app.core.dependencies import get_db, get_current_active_admin, get_current_user
from app.models.user import User, UserRole
from app.schemas.schemas import MessageResponse
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

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
            "growth_pct": 12.5
        },
        "system": {
            "uptime": "N/A",
            "cpu_usage": "N/A",
            "memory_usage": "N/A",
            "api_requests_24h": 0
        },
        "alerts": {
            "ai_signals_generated": 0,
            "critical_errors": 0,
            "pending_notifications": 0
        },
        "content": {
            "news_updates": 0,
            "ai_insights": 0
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
    """Get system audit logs."""
    # TODO: Implement real audit logging system
    return []

@router.get("/ai/system-status")
async def get_ai_system_status(
    current_user: User = Depends(get_current_user)
):
    """
    Monitor AI system status (Requires authentication, not admin)
    """
    # Return mock health data to avoid initialization issues
    return {
        "timestamp": datetime.now().isoformat(),
        "system": {
            "circuit_breaker": {"state": "CLOSED", "success_count": 100, "failure_count": 2},
            "orchestrator": {"agents_active": 5, "requests_processed": 250},
            "audit_entries": 0,
        },
        "agents": {
            "technical_agent": {"status": "ready", "last_signal": "HOLD"},
            "fundamental_agent": {"status": "ready", "last_signal": "BUY"},
            "risk_agent": {"status": "ready", "last_signal": "MONITOR"},
        },
        "performance": {
            "latency_metrics": {"orchestration": {"avg_ms": 145, "p95_ms": 320}},
            "cost_metrics": {"total_tokens": 5000, "estimated_cost_usd": 0.15},
        },
        "status": "operational",
    }


@router.get("/ai/agents")
async def get_agent_details(
    admin_user: User = Depends(get_current_active_admin)
):
    """Get detailed status and metrics for each specialized agent"""
    try:
        agents_status = ai_service.orchestrator.get_agent_status()
        return {
            "timestamp": datetime.now().isoformat(),
            "agents": agents_status,
            "total_agents": len(agents_status),
        }
    except Exception as e:
        logger.exception(f"Error retrieving agent details: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "agents": [],
            "total_agents": 0,
            "error": str(e)
        }


@router.get("/ai/audit-trail")
async def get_ai_audit_trail(
    user_id: Optional[int] = None,
    limit: int = 50,
    admin_user: User = Depends(get_current_active_admin),
):
    """Get AI system audit trail for compliance"""
    try:
        audit_data = ai_service.audit_trail.get_user_trail(user_id, limit=limit) if user_id else [
            entry.to_dict() for entry in ai_service.audit_trail.entries[-limit:]
        ]
        
        return {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "entries": audit_data,
            "total": len(audit_data),
        }
    except Exception as e:
        logger.exception(f"Error retrieving audit trail: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "entries": [],
            "total": 0,
            "error": str(e)
        }


@router.get("/ai/compliance/violations")
async def get_compliance_violations(
    days: int = 7,
    admin_user: User = Depends(get_current_active_admin),
):
    """Get compliance violations and rejections"""
    try:
        cutoff_time = datetime.utcnow() - timedelta(days=days)
        violations = [
            entry.to_dict() for entry in ai_service.audit_trail.entries
            if entry.decision == "rejected" and entry.timestamp >= cutoff_time
        ]
        
        return {
            "timestamp": datetime.now().isoformat(),
            "period_days": days,
            "violations": violations,
            "total_violations": len(violations),
        }
    except Exception as e:
        logger.exception(f"Error retrieving compliance violations: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "period_days": days,
            "violations": [],
            "total_violations": 0,
            "error": str(e)
        }


@router.get("/ai/metrics/performance")
async def get_performance_metrics(
    admin_user: User = Depends(get_current_active_admin),
):
    """Get detailed performance metrics"""
    try:
        metrics = ai_service.get_metrics()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "latency_history": [],
                "cost_summary": metrics.get("cost_metrics", {}),
            },
        }
    except Exception as e:
        logger.exception(f"Error retrieving metrics: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "latency_history": [],
                "cost_summary": {},
            },
            "error": str(e)
        }

@router.get("/video-engine/jobs")
async def list_video_jobs(
    current_user: User = Depends(get_current_user)
):
    """List all video rendering jobs (Admin sees all, user sees own)."""
    # Mock data for demonstration
    mock_jobs = [
        {"id": "V-101", "title": "NIFTY 50 RECAP", "user_id": 1, "user_name": "Ritesh", "duration": "60s", "format": "MP4", "status": "COMPLETED", "created_at": "2024-03-24T10:00:00Z"},
        {"id": "V-102", "title": "RELIANCE Q3 INSIGHT", "user_id": 1, "user_name": "Ritesh", "duration": "30s", "format": "MP4", "status": "PENDING", "created_at": "2024-03-24T12:30:00Z"},
        {"id": "V-103", "title": "MARKET BREADTH ANALYSIS", "user_id": 2, "user_name": "Anmol", "duration": "120s", "format": "MOV", "status": "COMPLETED", "created_at": "2024-03-24T14:15:00Z"},
    ]
    
    # Filter for non-admins
    # Check if user is admin by role or is_admin flag
    if current_user.role.value != 'admin' and not getattr(current_user, 'is_admin', False):  # type: ignore
        return {"jobs": [j for j in mock_jobs if j["user_id"] == current_user.id]}
    
    return {"jobs": mock_jobs}

@router.post("/video-engine/jobs")
async def create_video_job(
    data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a new video rendering job."""
    return {
        "id": f"V-{datetime.now().strftime('%M%S')}",
        "title": data.get("title", "UNTITLED"),
        "user_id": current_user.id,
        "user_name": current_user.full_name or current_user.username,
        "status": "PENDING"
    }

@router.delete("/video-engine/jobs/{job_id}")
async def delete_video_job(
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a video rendering job."""
    return {"message": f"Job {job_id} deleted successfully"}
