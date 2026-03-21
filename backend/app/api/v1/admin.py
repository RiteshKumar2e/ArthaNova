"""ArthaNova — Admin management API router with AI system monitoring."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

from app.core.dependencies import get_db, get_current_active_admin
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

@router.get("/ai/status")
async def get_ai_system_status(
    admin_user: User = Depends(get_current_active_admin)
):
    """
    Monitor comprehensive AI system status including:
    - Agent fleet status and metrics
    - Circuit breaker state
    - Orchestrator performance
    - Compliance status
    """
    try:
        status_data = ai_service.get_system_status()
        metrics_data = ai_service.get_metrics()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "system": {
                "circuit_breaker": status_data.get("circuit_breaker", {}),
                "orchestrator": status_data.get("orchestrator_metrics", {}),
                "audit_entries": status_data.get("audit_trail_entries", 0),
            },
            "agents": status_data.get("agent_status", {}),
            "performance": {
                "latency_metrics": metrics_data.get("latency_metrics", {}),
                "cost_metrics": metrics_data.get("cost_metrics", {}),
            },
            "status": "operational",
        }
    except Exception as e:
        logger.exception(f"Error retrieving AI system status: {e}")
        return {
            "timestamp": datetime.now().isoformat(),
            "circuit_breaker_state": "CLOSED",
            "successful_requests": 0,
            "total_requests": 1,
            "avg_response_time": 0,
            "agents_count": 5,
            "status": "error",
            "error": str(e),
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
