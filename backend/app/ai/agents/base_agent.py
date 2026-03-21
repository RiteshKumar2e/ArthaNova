"""
Base Agent Framework - Foundation for all specialized agents
Implements: Autonomy, Error Recovery, State Management, Tool Use
"""

from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Dict, List, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)


class AgentStatus(Enum):
    """Agent lifecycle states"""
    IDLE = "idle"
    PROCESSING = "processing"
    RECOVERING = "recovering"
    FAILED = "failed"
    COMPLETED = "completed"


class AgentCapability(Enum):
    """Agent specialized functions"""
    PORTFOLIO_ANALYSIS = "portfolio_analysis"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    TECHNICAL_ANALYSIS = "technical_analysis"
    COMPLIANCE_CHECK = "compliance_check"
    NEWS_ANALYSIS = "news_analysis"
    MARKET_SIGNALS = "market_signals"
    RISK_ASSESSMENT = "risk_assessment"


@dataclass
class AgentMetrics:
    """Track agent performance & autonomy"""
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    avg_response_time_ms: float = 0.0
    autonomous_decisions: int = 0
    error_recoveries: int = 0
    fallback_count: int = 0
    tools_invoked: int = 0
    last_updated: datetime = field(default_factory=datetime.utcnow)
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate percentage"""
        if self.total_requests == 0:
            return 0.0
        return (self.successful_requests / self.total_requests) * 100
    
    @property
    def autonomy_score(self) -> float:
        """Calculate autonomy (decisions without human input)"""
        if self.total_requests == 0:
            return 0.0
        return (self.autonomous_decisions / self.total_requests) * 100
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize metrics"""
        return {
            "total_requests": self.total_requests,
            "successful_requests": self.successful_requests,
            "failed_requests": self.failed_requests,
            "success_rate": f"{self.success_rate:.2f}%",
            "avg_response_time_ms": f"{self.avg_response_time_ms:.2f}",
            "autonomous_decisions": self.autonomous_decisions,
            "autonomy_score": f"{self.autonomy_score:.2f}%",
            "error_recoveries": self.error_recoveries,
            "fallback_count": self.fallback_count,
            "tools_invoked": self.tools_invoked,
            "last_updated": self.last_updated.isoformat(),
        }


@dataclass
class AgentContext:
    """Execution context passed between agents"""
    user_id: int
    session_id: Optional[int] = None
    query: str = ""
    portfolio_data: Optional[Dict] = None
    market_data: Optional[Dict] = None
    compliance_rules: Optional[List[Dict]] = None
    audit_trail: List[Dict] = field(default_factory=list)
    intermediate_results: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def add_audit_entry(self, agent_name: str, action: str, details: Dict) -> None:
        """Log action to audit trail"""
        self.audit_trail.append({
            "timestamp": datetime.utcnow().isoformat(),
            "agent": agent_name,
            "action": action,
            "details": details,
        })
    
    def set_intermediate_result(self, key: str, value: Any) -> None:
        """Store result for downstream agents"""
        self.intermediate_results[key] = value
        logger.debug(f"Intermediate result stored: {key}")
    
    def get_intermediate_result(self, key: str, default=None) -> Any:
        """Retrieve result from upstream agents"""
        return self.intermediate_results.get(key, default)


@dataclass
class AgentResponse:
    """Standardized agent output with metadata"""
    content: str
    agent_name: str
    capability: AgentCapability
    confidence_score: float  # 0.0-1.0
    status: AgentStatus
    tools_used: List[str] = field(default_factory=list)
    sources: List[Dict] = field(default_factory=list)
    reasoning: str = ""
    execution_time_ms: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    fallback_used: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize response"""
        return {
            "content": self.content,
            "agent_name": self.agent_name,
            "capability": self.capability.value,
            "confidence_score": f"{self.confidence_score:.2f}",
            "status": self.status.value,
            "tools_used": self.tools_used,
            "sources": self.sources,
            "reasoning": self.reasoning,
            "execution_time_ms": f"{self.execution_time_ms:.2f}",
            "error": self.error,
            "fallback_used": self.fallback_used,
        }


class Tool:
    """Tool definition for agent function calls"""
    
    def __init__(
        self,
        name: str,
        description: str,
        callable_func: Callable,
        parameters: Dict[str, Any],
        required_params: List[str],
    ):
        self.name = name
        self.description = description
        self.callable_func = callable_func
        self.parameters = parameters
        self.required_params = required_params
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize tool definition for LLM"""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters,
            "required": self.required_params,
        }
    
    async def invoke(self, **kwargs) -> Any:
        """Execute tool with validation"""
        # Validate required parameters
        missing = [p for p in self.required_params if p not in kwargs]
        if missing:
            raise ValueError(f"Missing required parameters: {missing}")
        
        # Call the function
        if callable(self.callable_func):
            import inspect
            if inspect.iscoroutinefunction(self.callable_func):
                return await self.callable_func(**kwargs)
            else:
                return self.callable_func(**kwargs)
        else:
            raise TypeError(f"Tool {self.name} is not callable")


class BaseAgent(ABC):
    """
    Base class for all AI agents
    Provides: Tool management, state tracking, error recovery, autonomy
    """
    
    def __init__(self, name: str, capability: AgentCapability):
        self.name = name
        self.capability = capability
        self.status = AgentStatus.IDLE
        self.metrics = AgentMetrics()
        self.tools: Dict[str, Tool] = {}
        self.logger = logger.getChild(self.name)
    
    def register_tool(self, tool: Tool) -> None:
        """Register a callable tool"""
        self.tools[tool.name] = tool
        self.logger.info(f"Tool registered: {tool.name}")
    
    def get_tools(self) -> List[Dict[str, Any]]:
        """Get all tools as LLM-compatible definitions"""
        return [tool.to_dict() for tool in self.tools.values()]
    
    async def invoke_tool(self, tool_name: str, **kwargs) -> Any:
        """Execute a registered tool"""
        if tool_name not in self.tools:
            self.logger.error(f"Tool not found: {tool_name}")
            self.metrics.failed_requests += 1
            raise ValueError(f"Unknown tool: {tool_name}")
        
        try:
            result = await self.tools[tool_name].invoke(**kwargs)
            self.metrics.tools_invoked += 1
            self.logger.debug(f"Tool executed: {tool_name}")
            return result
        except Exception as e:
            self.logger.exception(f"Tool execution failed: {tool_name}")
            self.metrics.failed_requests += 1
            raise
    
    @abstractmethod
    async def execute(self, context: AgentContext, user_input: str) -> AgentResponse:
        """
        Main agent execution logic - must be implemented by subclasses
        Responsible for autonomy and error recovery
        """
        pass
    
    async def handle_error(self, error: Exception, context: AgentContext) -> AgentResponse:
        """
        Error recovery mechanism - enables autonomy
        Subclasses can override for specialized recovery
        """
        self.logger.error(f"Error in {self.name}: {str(error)}", exc_info=True)
        self.metrics.error_recoveries += 1
        self.metrics.failed_requests += 1
        self.status = AgentStatus.FAILED
        
        context.add_audit_entry(
            self.name,
            "error_recovery",
            {"error": str(error), "agent_status": self.status.value}
        )
        
        return AgentResponse(
            content=f"I encountered an issue during {self.name.lower()}: {str(error)[:100]}. Please try again.",
            agent_name=self.name,
            capability=self.capability,
            confidence_score=0.0,
            status=self.status,
            error=str(error),
        )
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get agent performance metrics"""
        return self.metrics.to_dict()
    
    def update_metrics(
        self,
        response_time_ms: float,
        success: bool,
        autonomous: bool = True,
        fallback: bool = False,
    ) -> None:
        """Update agent metrics after execution"""
        self.metrics.total_requests += 1
        if success:
            self.metrics.successful_requests += 1
        if autonomous:
            self.metrics.autonomous_decisions += 1
        if fallback:
            self.metrics.fallback_count += 1
        
        # Update rolling average
        total_ms = self.metrics.avg_response_time_ms * (self.metrics.total_requests - 1)
        self.metrics.avg_response_time_ms = (total_ms + response_time_ms) / self.metrics.total_requests
