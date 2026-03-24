"""
Agent Orchestrator - Coordinates multi-agent execution
Implements: Multi-Agent Design, Orchestration Patterns, Autonomous Routing
"""

import asyncio
import time
import json
import logging
from typing import Dict, List, Optional, Any
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime

from .base_agent import AgentContext, AgentResponse, AgentStatus, AgentCapability
from .specialized_agents import (
    PortfolioAnalyzerAgent,
    SentimentAnalyzerAgent,
    TechnicalAnalyzerAgent,
    ComplianceCheckerAgent,
    NewsAnalyzerAgent,
)

logger = logging.getLogger(__name__)


class QueryType(Enum):
    """Classify user queries for routing"""
    PORTFOLIO_ANALYSIS = "portfolio"
    MARKET_SENTIMENT = "sentiment"
    TECHNICAL_ANALYSIS = "technical"
    NEWS_ANALYSIS = "news"
    COMPLIANCE_CHECK = "compliance"
    GENERAL_INQUIRY = "general"
    MULTI_AGENT = "multi_agent"


@dataclass
class OrchestrationPlan:
    """Execution plan for agent orchestration"""
    primary_agent: str
    supporting_agents: List[str] = field(default_factory=list)
    execution_order: List[str] = field(default_factory=list)
    parallel_execution: List[List[str]] = field(default_factory=list)
    compliance_required: bool = False
    estimated_time_ms: float = 0.0
    description: str = ""


@dataclass
class OrchestratorMetrics:
    """Track orchestrator performance"""
    total_queries: int = 0
    queries_routed_correctly: int = 0
    multi_agent_executions: int = 0
    avg_coordination_time_ms: float = 0.0
    total_agents_invoked: int = 0
    compliance_blocks: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize metrics"""
        return {
            "total_queries": self.total_queries,
            "queries_routed_correctly": self.queries_routed_correctly,
            "multi_agent_executions": self.multi_agent_executions,
            "avg_coordination_time_ms": f"{self.avg_coordination_time_ms:.2f}",
            "total_agents_invoked": self.total_agents_invoked,
            "compliance_blocks": self.compliance_blocks,
        }


class AgentOrchestrator:
    """
    Coordinates multi-agent execution with intelligent routing and fallback handling.
    Enables autonomous team decision-making through orchestration patterns.
    """
    
    def __init__(self, ai_service):
        self.ai_service = ai_service
        self.logger = logger.getChild("AgentOrchestrator")
        self.metrics = OrchestratorMetrics()
        
        # Initialize specialized agents
        self.agents = {
            "portfolio": PortfolioAnalyzerAgent(ai_service),
            "sentiment": SentimentAnalyzerAgent(ai_service),
            "technical": TechnicalAnalyzerAgent(ai_service),
            "compliance": ComplianceCheckerAgent(ai_service),
            "news": NewsAnalyzerAgent(ai_service),
        }
        
        # Query classification keywords
        self.routing_keywords = {
            QueryType.PORTFOLIO_ANALYSIS: [
                "portfolio", "holding", "allocation", "diversification", "rebalance",
                "my stocks", "my investments", "risk", "return", "performance"
            ],
            QueryType.MARKET_SENTIMENT: [
                "sentiment", "bullish", "bearish", "mood", "investor", "market trend",
                "confidence", "outlook", "opinion", "forecast"
            ],
            QueryType.TECHNICAL_ANALYSIS: [
                "technical", "pattern", "support", "resistance", "trend", "chart",
                "moving average", "macd", "rsi", "candlestick", "breakout"
            ],
            QueryType.NEWS_ANALYSIS: [
                "news", "announcement", "earnings", "event", "headline",
                "development", "breaking", "report", "filing", "sec"
            ],
            QueryType.COMPLIANCE_CHECK: [
                "compliance", "regulation", "rule", "limit", "allowed", "permitted",
                "risk limit", "concentration", "sector limit"
            ],
        }
    
    def classify_query(self, user_input: str) -> QueryType:
        """
        Autonomously classify query type for intelligent routing.
        Returns: QueryType to determine agent(s) to invoke
        """
        user_input_lower = user_input.lower()
        
        # Score each query type
        scores = {}
        for query_type, keywords in self.routing_keywords.items():
            score = sum(1 for keyword in keywords if keyword in user_input_lower)
            scores[query_type] = score
        
        # Find best match (autonomy: no human input needed)
        if max(scores.values()) > 0:
            best_type = max(scores, key=lambda q: scores[q])
            self.logger.debug(f"Query classified as: {best_type.value}")
            return best_type
        
        self.logger.debug("Query classified as: general_inquiry")
        return QueryType.GENERAL_INQUIRY
    
    def create_orchestration_plan(
        self,
        query_type: QueryType,
        portfolio_data: Optional[Dict] = None,
    ) -> OrchestrationPlan:
        """
        Create multi-agent execution plan based on query type.
        Enables autonomous coordination without human orchestration.
        """
        
        # Define execution plans for each query type
        plans = {
            QueryType.PORTFOLIO_ANALYSIS: OrchestrationPlan(
                primary_agent="portfolio",
                supporting_agents=["compliance"],
                parallel_execution=[["portfolio"], ["compliance"]],
                compliance_required=True,
                description="Analyze portfolio with compliance validation",
            ),
            QueryType.MARKET_SENTIMENT: OrchestrationPlan(
                primary_agent="sentiment",
                supporting_agents=["news"],
                parallel_execution=[["sentiment", "news"]],
                description="Analyze market sentiment from news and data",
            ),
            QueryType.TECHNICAL_ANALYSIS: OrchestrationPlan(
                primary_agent="technical",
                supporting_agents=["compliance"],
                parallel_execution=[["technical"], ["compliance"]],
                compliance_required=True,
                description="Analyze technical patterns and validate compliance",
            ),
            QueryType.NEWS_ANALYSIS: OrchestrationPlan(
                primary_agent="news",
                supporting_agents=["sentiment", "compliance"],
                parallel_execution=[["news", "sentiment"], ["compliance"]],
                description="Analyze news with sentiment and compliance checks",
            ),
            QueryType.COMPLIANCE_CHECK: OrchestrationPlan(
                primary_agent="compliance",
                compliance_required=True,
                description="Run compliance validation",
            ),
            QueryType.GENERAL_INQUIRY: OrchestrationPlan(
                primary_agent="sentiment",
                supporting_agents=["news"],
                description="General market inquiry",
            ),
        }
        
        plan = plans.get(query_type, plans[QueryType.GENERAL_INQUIRY])
        
        # Update execution order
        if plan.parallel_execution:
            plan.execution_order = [agent for group in plan.parallel_execution for agent in group]
        else:
            plan.execution_order = [plan.primary_agent] + plan.supporting_agents
        
        self.logger.info(f"Orchestration plan created: {plan.description} | Agents: {plan.execution_order}")
        return plan
    
    async def execute_sequential(
        self,
        agents_list: List[str],
        context: AgentContext,
        user_input: str,
    ) -> Dict[str, AgentResponse]:
        """Execute agents sequentially with output chaining"""
        results = {}
        
        for agent_name in agents_list:
            if agent_name not in self.agents:
                self.logger.warning(f"Agent not found: {agent_name}")
                continue
            
            try:
                agent = self.agents[agent_name]
                response = await agent.execute(context, user_input)
                results[agent_name] = response
                
                context.set_intermediate_result(f"{agent_name}_response", response)
                self.logger.debug(f"Agent {agent_name} completed: {response.status.value}")
                
            except Exception as e:
                self.logger.error(f"Agent {agent_name} failed: {e}", exc_info=True)
                results[agent_name] = AgentResponse(
                    content=f"Error during {agent_name} execution",
                    agent_name=agent_name,
                    capability=AgentCapability.PORTFOLIO_ANALYSIS,
                    confidence_score=0.0,
                    status=AgentStatus.FAILED,
                    error=str(e),
                )
        
        return results
    
    async def execute_parallel(
        self,
        agents_groups: List[List[str]],
        context: AgentContext,
        user_input: str,
    ) -> Dict[str, AgentResponse]:
        """Execute agent groups in parallel for efficiency"""
        results = {}
        
        for agent_group in agents_groups:
            tasks = []
            agent_names = []
            
            for agent_name in agent_group:
                if agent_name in self.agents:
                    agent_names.append(agent_name)
                    tasks.append(self.agents[agent_name].execute(context, user_input))
            
            if tasks:
                try:
                    responses = await asyncio.gather(*tasks, return_exceptions=True)
                    
                    for agent_name, response in zip(agent_names, responses):
                        if isinstance(response, Exception):
                            self.logger.error(f"Agent {agent_name} failed: {response}")
                            results[agent_name] = AgentResponse(
                                content=f"Error: {str(response)}",
                                agent_name=agent_name,
                                capability=AgentCapability.PORTFOLIO_ANALYSIS,
                                confidence_score=0.0,
                                status=AgentStatus.FAILED,
                                error=str(response),
                            )
                        else:
                            results[agent_name] = response
                            context.set_intermediate_result(f"{agent_name}_response", response)
                
                except Exception as e:
                    self.logger.error(f"Parallel execution failed: {e}", exc_info=True)
        
        return results
    
    async def synthesize_responses(
        self,
        agent_responses: Dict[str, AgentResponse],
        user_input: str,
    ) -> str:
        """
        Synthesize multi-agent responses into coherent final answer.
        Demonstrates technical creativity and intelligent synthesis.
        """
        try:
            # Format agent outputs
            synthesis_context = "Multi-Agent Analysis Results:\n\n"
            
            for agent_name, response in agent_responses.items():
                synthesis_context += f"[{agent_name.upper()}]\n"
                synthesis_context += f"Content: {response.content}\n"
                synthesis_context += f"Confidence: {response.confidence_score:.2f}\n"
                if response.reasoning:
                    synthesis_context += f"Reasoning: {response.reasoning}\n"
                synthesis_context += "\n"
            
            # Use LLM to synthesize
            synthesis_prompt = """You are a senior investment advisor synthesizing multi-agent analysis.
Combine the following agent outputs into a cohesive, actionable recommendation:
- Acknowledge each agent's perspective
- Identify consensus and disagreements
- Provide a unified recommendation
- List key risks and opportunities

Be concise, professional, and specific."""
            
            synthesis_messages = [
                {"role": "system", "content": synthesis_prompt},
                {"role": "user", "content": f"{synthesis_context}\nOriginal Query: {user_input}"}
            ]
            
            final_response = await self.ai_service.get_chat_completion(synthesis_messages)
            return final_response
        
        except Exception as e:
            self.logger.error(f"Response synthesis failed: {e}")
            return "Unable to synthesize multi-agent responses. Please review individual agent responses above."
    
    async def orchestrate(
        self,
        user_input: str,
        context: AgentContext,
    ) -> Dict[str, Any]:
        """
        Main orchestration method - coordinates multi-agent execution.
        Implements autonomy, multi-agent design, and error recovery.
        """
        orchestration_start = time.time()
        
        try:
            self.metrics.total_queries += 1
            
            # STEP 1: Classify query (autonomous routing)
            query_type = self.classify_query(user_input)
            context.add_audit_entry("orchestrator", "query_classification", {"query_type": query_type.value})
            
            # STEP 2: Create orchestration plan (autonomous planning)
            plan = self.create_orchestration_plan(
                query_type,
                context.portfolio_data,
            )
            
            # STEP 3: Execute agents based on plan
            agent_responses = {}
            
            if plan.parallel_execution:
                agent_responses = await self.execute_parallel(
                    plan.parallel_execution,
                    context,
                    user_input,
                )
            else:
                agent_responses = await self.execute_sequential(
                    plan.execution_order,
                    context,
                    user_input,
                )
            
            self.metrics.total_agents_invoked += len(agent_responses)
            
            # STEP 4: Compliance check if required
            final_response = None
            if plan.compliance_required and "compliance" not in agent_responses:
                compliance_response = await self.agents["compliance"].execute(context, user_input)
                agent_responses["compliance"] = compliance_response
                
                if not compliance_response.content.startswith("Compliant"):
                    self.metrics.compliance_blocks += 1
            
            # STEP 5: Synthesize responses (multi-agent design demonstration)
            if len(agent_responses) > 1:
                final_response = await self.synthesize_responses(agent_responses, user_input)
                self.metrics.multi_agent_executions += 1
            elif len(agent_responses) == 1:
                agent = list(agent_responses.values())[0]
                final_response = agent.content
            else:
                # No agents invoked - fallback to direct LLM call via ai_service
                self.logger.warning("No agents invoked for query, falling back to direct LLM")
                final_response = await self.ai_service.get_chat_completion([
                    {"role": "system", "content": "You are ArthaNova AI. Provide a direct helpful response to the user query."},
                    {"role": "user", "content": user_input}
                ])
            
            # Record metrics
            orchestration_time_ms = (time.time() - orchestration_start) * 1000
            total_ms = orchestration_time_ms
            for response in agent_responses.values():
                total_ms += response.execution_time_ms
            
            avg_time = orchestration_time_ms + sum(r.execution_time_ms for r in agent_responses.values())
            self.metrics.avg_coordination_time_ms = avg_time / len(agent_responses) if agent_responses else 0
            
            context.add_audit_entry(
                "orchestrator",
                "execution_complete",
                {
                    "agents_invoked": list(agent_responses.keys()),
                    "execution_time_ms": orchestration_time_ms,
                    "total_time_ms": total_ms,
                    "query_type": query_type.value,
                },
            )
            
            return {
                "success": True,
                "final_response": final_response,
                "agent_responses": {k: v.to_dict() for k, v in agent_responses.items()},
                "audit_trail": context.audit_trail,
                "execution_time_ms": orchestration_time_ms,
                "query_type": query_type.value,
            }
        
        except Exception as e:
            self.logger.error(f"Orchestration failed: {e}", exc_info=True)
            context.add_audit_entry("orchestrator", "orchestration_failed", {"error": str(e)})
            
            return {
                "success": False,
                "error": str(e),
                "final_response": "An error occurred during multi-agent orchestration. Please try again.",
                "audit_trail": context.audit_trail,
            }
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get orchestrator performance metrics"""
        return self.metrics.to_dict()
    
    def get_agent_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all agents"""
        return {
            name: {
                "name": name,
                "capability": agent.capability.value,
                "status": agent.status.value,
                "metrics": agent.get_metrics(),
            }
            for name, agent in self.agents.items()
        }
