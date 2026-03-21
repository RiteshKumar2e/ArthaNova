"""
Enterprise Error Handling, Circuit Breaker, and Observability
Implements: Enterprise Readiness, Compliance, Audit Trails, Graceful Degradation
"""

import asyncio
import time
import json
from enum import Enum
from typing import Dict, Optional, Any, List, Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class ErrorSeverity(Enum):
    """Structured error classification for proper handling"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class CircuitBreakerState(Enum):
    """Circuit breaker states"""
    CLOSED = "closed"  # Normal operation
    OPEN = "open"  # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing recovery


@dataclass
class StructuredError:
    """Enterprise-grade error with full context"""
    error_code: str
    severity: ErrorSeverity
    message: str
    details: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    user_id: Optional[int] = None
    agent_name: Optional[str] = None
    stack_trace: Optional[str] = None
    is_compliance_violation: bool = False
    recovery_action: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize for logging and audit trails"""
        return {
            "error_code": self.error_code,
            "severity": self.severity.value,
            "message": self.message,
            "details": self.details,
            "timestamp": self.timestamp.isoformat(),
            "user_id": self.user_id,
            "agent_name": self.agent_name,
            "is_compliance_violation": self.is_compliance_violation,
            "recovery_action": self.recovery_action,
        }


class CircuitBreaker:
    """
    Circuit breaker pattern for resilience.
    Prevents cascading failures and enables graceful degradation.
    """
    
    def __init__(
        self,
        name: str,
        failure_threshold: int = 5,
        recovery_timeout: int = 60,
        expected_exception: type[Exception] = Exception,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time: Optional[datetime] = None
        self.state = CircuitBreakerState.CLOSED
        self.logger = logger.getChild(f"CircuitBreaker[{name}]")
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection"""
        if self.state == CircuitBreakerState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitBreakerState.HALF_OPEN
                self.logger.info(f"Circuit breaker {self.name} entering HALF_OPEN state")
            else:
                raise Exception(f"Circuit breaker {self.name} is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            if isinstance(e, self.expected_exception):
                self._on_failure()
            raise
    
    async def call_async(self, func: Callable, *args, **kwargs) -> Any:
        """Execute async function with circuit breaker protection"""
        if self.state == CircuitBreakerState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitBreakerState.HALF_OPEN
                self.logger.info(f"Circuit breaker {self.name} entering HALF_OPEN state")
            else:
                raise Exception(f"Circuit breaker {self.name} is OPEN")
        
        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            if isinstance(e, self.expected_exception):
                self._on_failure()
            raise
    
    def _should_attempt_reset(self) -> bool:
        """Check if recovery timeout has elapsed"""
        if self.last_failure_time is None:
            return True
        elapsed = (datetime.utcnow() - self.last_failure_time).total_seconds()
        return elapsed >= self.recovery_timeout
    
    def _on_success(self):
        """Reset on successful call"""
        self.failure_count = 0
        self.success_count += 1
        
        if self.state == CircuitBreakerState.HALF_OPEN:
            self.state = CircuitBreakerState.CLOSED
            self.logger.info(f"Circuit breaker {self.name} RECOVERED to CLOSED state")
    
    def _on_failure(self):
        """Increment failure count and open circuit if threshold exceeded"""
        self.failure_count += 1
        self.last_failure_time = datetime.utcnow()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitBreakerState.OPEN
            self.logger.warning(
                f"Circuit breaker {self.name} opened after {self.failure_count} failures"
            )
    
    def get_state(self) -> Dict[str, Any]:
        """Get circuit breaker status"""
        return {
            "name": self.name,
            "state": self.state.value,
            "failure_count": self.failure_count,
            "success_count": self.success_count,
            "last_failure_time": self.last_failure_time.isoformat() if self.last_failure_time else None,
        }


@dataclass
class AuditLog:
    """Immutable audit entry for compliance"""
    timestamp: datetime = field(default_factory=datetime.utcnow)
    user_id: int = 0
    action: str = ""
    entity_type: str = ""  # portfolio, recommendation, trade, etc.
    entity_id: str = ""
    details: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    compliance_checked: bool = False
    decision: str = ""  # approved, rejected, escalated
    decision_reason: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize for storage"""
        return {
            "timestamp": self.timestamp.isoformat(),
            "user_id": self.user_id,
            "action": self.action,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "details": self.details,
            "error": self.error,
            "compliance_checked": self.compliance_checked,
            "decision": self.decision,
            "decision_reason": self.decision_reason,
        }


class AuditTrail:
    """Maintain immutable compliance audit log"""
    
    def __init__(self, max_entries: int = 10000):
        self.entries: List[AuditLog] = []
        self.max_entries = max_entries
        self.logger = logger.getChild("AuditTrail")
    
    def log(
        self,
        user_id: int,
        action: str,
        entity_type: str,
        entity_id: str,
        details: Optional[Dict] = None,
        error: Optional[str] = None,
        compliance_checked: bool = False,
        decision: str = "",
        decision_reason: str = "",
    ) -> AuditLog:
        """Create immutable audit entry"""
        entry = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details or {},
            error=error,
            compliance_checked=compliance_checked,
            decision=decision,
            decision_reason=decision_reason,
        )
        
        self.entries.append(entry)
        
        # Trim old entries
        if len(self.entries) > self.max_entries:
            self.entries = self.entries[-self.max_entries:]
        
        self.logger.debug(f"Audit entry logged: {entity_type}:{entity_id}:{action}")
        return entry
    
    def get_user_trail(self, user_id: int, limit: int = 50) -> List[Dict]:
        """Retrieve user's audit trail for compliance"""
        user_entries = [e for e in self.entries if e.user_id == user_id]
        return [e.to_dict() for e in user_entries[-limit:]]
    
    def get_rejected_decisions(self, user_id: Optional[int] = None, limit: int = 50) -> List[Dict]:
        """Get all rejected recommendations (compliance critical)"""
        entries = self.entries
        if user_id:
            entries = [e for e in entries if e.user_id == user_id]
        
        rejected = [e for e in entries if e.decision == "rejected"]
        return [e.to_dict() for e in rejected[-limit:]]
    
    def to_json(self, user_id: Optional[int] = None) -> str:
        """Export audit log as immutable JSON"""
        entries = self.get_user_trail(user_id, limit=1000) if user_id else [
            e.to_dict() for e in self.entries
        ]
        return json.dumps(entries, indent=2)


class ComplianceGuardrails:
    """Enforce regulatory and business compliance rules"""
    
    # Regulatory limits (configurable)
    MAX_SINGLE_POSITION_PERCENT = 30
    MAX_SECTOR_EXPOSURE_PERCENT = 50
    MIN_PORTFOLIO_DIVERSIFICATION = 5
    MAX_LEVERAGE_RATIO = 2.0
    
    def __init__(self):
        self.logger = logger.getChild("ComplianceGuardrails")
        self.audit_trail = AuditTrail()
    
    async def check_position_limit(
        self,
        user_id: int,
        symbol: str,
        proposed_allocation: float,
    ) -> tuple[bool, str]:
        """Check single position concentration limit"""
        if proposed_allocation > self.MAX_SINGLE_POSITION_PERCENT:
            reason = f"Position exceeds {self.MAX_SINGLE_POSITION_PERCENT}% limit"
            self.logger.warning(f"Position limit violation for user {user_id}: {symbol} {proposed_allocation}%")
            
            self.audit_trail.log(
                user_id=user_id,
                action="position_limit_check",
                entity_type="position",
                entity_id=symbol,
                details={"proposed_allocation": proposed_allocation},
                compliance_checked=True,
                decision="rejected",
                decision_reason=reason,
            )
            
            return False, reason
        
        return True, "Approved"
    
    async def check_sector_limit(
        self,
        user_id: int,
        sector: str,
        proposed_sector_allocation: float,
    ) -> tuple[bool, str]:
        """Check sector concentration limit"""
        if proposed_sector_allocation > self.MAX_SECTOR_EXPOSURE_PERCENT:
            reason = f"Sector exposure exceeds {self.MAX_SECTOR_EXPOSURE_PERCENT}% limit"
            self.logger.warning(f"Sector limit violation for user {user_id}: {sector} {proposed_sector_allocation}%")
            
            self.audit_trail.log(
                user_id=user_id,
                action="sector_limit_check",
                entity_type="sector",
                entity_id=sector,
                details={"proposed_allocation": proposed_sector_allocation},
                compliance_checked=True,
                decision="rejected",
                decision_reason=reason,
            )
            
            return False, reason
        
        return True, "Approved"
    
    async def check_leverage_limit(
        self,
        user_id: int,
        leverage_ratio: float,
    ) -> tuple[bool, str]:
        """Check leverage ratio"""
        if leverage_ratio > self.MAX_LEVERAGE_RATIO:
            reason = f"Leverage exceeds {self.MAX_LEVERAGE_RATIO}x limit"
            self.logger.warning(f"Leverage limit violation for user {user_id}: {leverage_ratio}x")
            
            self.audit_trail.log(
                user_id=user_id,
                action="leverage_check",
                entity_type="leverage",
                entity_id=f"{leverage_ratio}x",
                compliance_checked=True,
                decision="rejected",
                decision_reason=reason,
            )
            
            return False, reason
        
        return True, "Approved"


class MetricsCollector:
    """Collect and track system-wide metrics for observability"""
    
    def __init__(self):
        self.logger = logger.getChild("MetricsCollector")
        self.metrics: Dict[str, List[float]] = {}
        self.event_history: List[Dict] = []
    
    async def record_latency(self, metric_name: str, latency_ms: float) -> None:
        """Record API latency"""
        if metric_name not in self.metrics:
            self.metrics[metric_name] = []
        
        self.metrics[metric_name].append(latency_ms)
        
        # Keep last 1000 measurements
        if len(self.metrics[metric_name]) > 1000:
            self.metrics[metric_name] = self.metrics[metric_name][-1000:]
    
    async def record_token_usage(
        self,
        user_id: int,
        tokens_used: int,
        cost: float,
        feature: str = "chat",
    ) -> None:
        """Record token usage for billing and optimization"""
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "tokens": tokens_used,
            "cost": cost,
            "feature": feature,
        }
        self.event_history.append(event)
        self.logger.debug(f"Token usage recorded: user={user_id}, tokens={tokens_used}, cost=${cost:.4f}")
    
    def get_metrics_summary(self, metric_name: str) -> Dict[str, float]:
        """Get statistics for a metric"""
        if metric_name not in self.metrics:
            return {}
        
        values = self.metrics[metric_name]
        if not values:
            return {}
        
        return {
            "count": len(values),
            "min_ms": min(values),
            "max_ms": max(values),
            "avg_ms": sum(values) / len(values),
            "p95_ms": sorted(values)[int(len(values) * 0.95)],
            "p99_ms": sorted(values)[int(len(values) * 0.99)],
        }
    
    def get_cost_summary(self, user_id: Optional[int] = None) -> Dict[str, Any]:
        """Get token usage and cost metrics"""
        events = self.event_history
        
        if user_id:
            events = [e for e in events if e["user_id"] == user_id]
        
        total_tokens = sum(e["tokens"] for e in events)
        total_cost = sum(e["cost"] for e in events)
        
        return {
            "total_events": len(events),
            "total_tokens": total_tokens,
            "total_cost": f"${total_cost:.4f}",
            "by_feature": self._group_by_feature(events),
        }
    
    def _group_by_feature(self, events: List[Dict]) -> Dict[str, Dict]:
        """Group metrics by feature"""
        grouped = {}
        for event in events:
            feature = event.get("feature", "unknown")
            if feature not in grouped:
                grouped[feature] = {"tokens": 0, "cost": 0.0}
            grouped[feature]["tokens"] += event["tokens"]
            grouped[feature]["cost"] += event["cost"]
        
        return grouped
