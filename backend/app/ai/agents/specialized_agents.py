"""
Specialized AI Agents for ArthaNova
Each agent handles a specific domain with autonomous decision-making and tool use
"""

import asyncio
import json
import time
from typing import Any, Dict, List, Optional
import logging
from dataclasses import dataclass

from .base_agent import (
    BaseAgent,
    AgentCapability,
    AgentContext,
    AgentResponse,
    AgentStatus,
    Tool,
)

logger = logging.getLogger(__name__)


class PortfolioAnalyzerAgent(BaseAgent):
    """Analyzes user portfolios for risk, diversification, and optimization opportunities"""
    
    def __init__(self, ai_service):
        super().__init__("PortfolioAnalyzer", AgentCapability.PORTFOLIO_ANALYSIS)
        self.ai_service = ai_service
        
        # Register tools
        self.register_tool(Tool(
            name="calculate_portfolio_metrics",
            description="Calculate key portfolio metrics: total value, allocation %, risk score",
            callable_func=self._calculate_metrics,
            parameters={"holdings": {"type": "array", "items": {"type": "object"}}},
            required_params=["holdings"],
        ))
        
        self.register_tool(Tool(
            name="check_diversification",
            description="Analyze portfolio diversification by sector and asset class",
            callable_func=self._check_diversification,
            parameters={"holdings": {"type": "array"}},
            required_params=["holdings"],
        ))
    
    async def _calculate_metrics(self, holdings: List[Dict]) -> Dict:
        """Calculate portfolio metrics autonomously"""
        try:
            total_value = sum(h.get("value", 0) for h in holdings)
            allocation = [
                {
                    "symbol": h["symbol"],
                    "percentage": (h.get("value", 0) / total_value * 100) if total_value > 0 else 0,
                }
                for h in holdings
            ]
            return {"total_value": total_value, "allocation": allocation}
        except Exception as e:
            logger.error(f"Metrics calculation failed: {e}")
            raise
    
    async def _check_diversification(self, holdings: List[Dict]) -> Dict:
        """Analyze diversification autonomously"""
        try:
            sectors = {}
            for h in holdings:
                sector = h.get("sector", "Unknown")
                sectors[sector] = sectors.get(sector, 0) + h.get("value", 0)
            
            diversification_score = 100 / len(sectors) if sectors else 0
            return {"sectors": sectors, "diversification_score": diversification_score}
        except Exception as e:
            logger.error(f"Diversification check failed: {e}")
            raise
    
    async def execute(self, context: AgentContext, user_input: str) -> AgentResponse:
        """Analyze portfolio with autonomous tool use and decision-making"""
        start_time = time.time()
        self.status = AgentStatus.PROCESSING
        
        try:
            context.add_audit_entry(self.name, "execution_start", {"query": user_input})
            
            portfolio_data = context.portfolio_data or {"holdings": []}
            
            # Autonomous tool invocation - portfolio analysis
            metrics = await self.invoke_tool("calculate_portfolio_metrics", holdings=portfolio_data.get("holdings", []))
            diversification = await self.invoke_tool(
                "check_diversification",
                holdings=portfolio_data.get("holdings", [])
            )
            
            context.set_intermediate_result("portfolio_metrics", metrics)
            context.set_intermediate_result("diversification_analysis", diversification)
            
            # Generate analysis via LLM
            system_prompt = """You are an expert portfolio analyst. Analyze the following portfolio data and provide:
1. Current allocation summary
2. Diversification assessment
3. Risk level estimation
4. 2 specific optimization opportunities
Keep response concise and actionable."""
            
            analysis_messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""Portfolio Data: {json.dumps({"metrics": metrics, "diversification": diversification})}
User Query: {user_input}"""}
            ]
            
            llm_response = await self.ai_service.get_chat_completion(analysis_messages)
            
            execution_time_ms = (time.time() - start_time) * 1000
            self.status = AgentStatus.COMPLETED
            self.update_metrics(execution_time_ms, success=True, autonomous=True)
            
            context.add_audit_entry(
                self.name,
                "execution_complete",
                {"response_length": len(llm_response), "tools_used": ["calculate_portfolio_metrics", "check_diversification"]},
            )
            
            return AgentResponse(
                content=llm_response,
                agent_name=self.name,
                capability=self.capability,
                confidence_score=0.85,
                status=self.status,
                tools_used=["calculate_portfolio_metrics", "check_diversification"],
                execution_time_ms=execution_time_ms,
                reasoning="Used autonomous tools to analyze portfolio metrics and diversification before generating analysis.",
            )
        
        except Exception as e:
            return await self.handle_error(e, context)


class SentimentAnalyzerAgent(BaseAgent):
    """Analyzes market sentiment and company news"""
    
    def __init__(self, ai_service):
        super().__init__("SentimentAnalyzer", AgentCapability.SENTIMENT_ANALYSIS)
        self.ai_service = ai_service
        
        self.register_tool(Tool(
            name="classify_sentiment",
            description="Classify sentiment as positive, negative, or neutral with confidence score",
            callable_func=self._classify_sentiment,
            parameters={"text": {"type": "string"}},
            required_params=["text"],
        ))
    
    async def _classify_sentiment(self, text: str) -> Dict:
        """Autonomously classify sentiment"""
        try:
            # Simple heuristic sentiment (can be replaced with ML model)
            positive_words = ["bullish", "strong", "growth", "gains", "positive", "excellent"]
            negative_words = ["bearish", "weak", "decline", "losses", "negative", "poor"]
            
            text_lower = text.lower()
            pos_count = sum(text_lower.count(w) for w in positive_words)
            neg_count = sum(text_lower.count(w) for w in negative_words)
            
            if pos_count > neg_count:
                sentiment, score = "positive", min(0.95, 0.5 + pos_count * 0.1)
            elif neg_count > pos_count:
                sentiment, score = "negative", min(0.95, 0.5 + neg_count * 0.1)
            else:
                sentiment, score = "neutral", 0.6
            
            return {"sentiment": sentiment, "confidence": score}
        except Exception as e:
            logger.error(f"Sentiment classification failed: {e}")
            raise
    
    async def execute(self, context: AgentContext, user_input: str) -> AgentResponse:
        """Analyze sentiment with autonomous classification"""
        start_time = time.time()
        self.status = AgentStatus.PROCESSING
        
        try:
            context.add_audit_entry(self.name, "execution_start", {"query": user_input})
            
            # Autonomous sentiment analysis
            sentiment = await self.invoke_tool("classify_sentiment", text=user_input)
            context.set_intermediate_result("sentiment_classification", sentiment)
            
            system_prompt = """You are a market sentiment analyst. Based on the sentiment classification and user query, provide:
1. Overall market sentiment assessment
2. Key drivers of this sentiment
3. Potential impact on investment strategy
Be concise and data-driven."""
            
            analysis_messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""Sentiment Classification: {json.dumps(sentiment)}
Analysis Request: {user_input}"""}
            ]
            
            llm_response = await self.ai_service.get_chat_completion(analysis_messages)
            
            execution_time_ms = (time.time() - start_time) * 1000
            self.status = AgentStatus.COMPLETED
            self.update_metrics(execution_time_ms, success=True, autonomous=True)
            
            context.add_audit_entry(
                self.name,
                "execution_complete",
                {"sentiment": sentiment["sentiment"], "confidence": sentiment["confidence"]},
            )
            
            return AgentResponse(
                content=llm_response,
                agent_name=self.name,
                capability=self.capability,
                confidence_score=sentiment["confidence"],
                status=self.status,
                tools_used=["classify_sentiment"],
                execution_time_ms=execution_time_ms,
                reasoning=f"Autonomously classified sentiment as {sentiment['sentiment']} before analysis.",
            )
        
        except Exception as e:
            return await self.handle_error(e, context)


class TechnicalAnalyzerAgent(BaseAgent):
    """Analyzes technical chart patterns and indicators"""
    
    def __init__(self, ai_service):
        super().__init__("TechnicalAnalyzer", AgentCapability.TECHNICAL_ANALYSIS)
        self.ai_service = ai_service
        
        self.register_tool(Tool(
            name="detect_chart_pattern",
            description="Detect technical chart patterns like heads-and-shoulders, triangles, etc.",
            callable_func=self._detect_pattern,
            parameters={"symbol": {"type": "string"}},
            required_params=["symbol"],
        ))
    
    async def _detect_pattern(self, symbol: str) -> Dict:
        """Autonomously detect chart patterns"""
        try:
            # Simulated pattern detection
            patterns = [
                {"pattern": "Ascending Triangle", "strength": 0.78, "direction": "bullish"},
                {"pattern": "Moving Average Crossover", "strength": 0.82, "direction": "bullish"},
            ]
            return {"symbol": symbol, "patterns": patterns}
        except Exception as e:
            logger.error(f"Pattern detection failed: {e}")
            raise
    
    async def execute(self, context: AgentContext, user_input: str) -> AgentResponse:
        """Analyze technical patterns with autonomous detection"""
        start_time = time.time()
        self.status = AgentStatus.PROCESSING
        
        try:
            context.add_audit_entry(self.name, "execution_start", {"query": user_input})
            
            # Extract symbol from user input
            symbol = user_input.upper().split()[0] if user_input else "UNKNOWN"
            
            # Autonomous pattern detection
            patterns = await self.invoke_tool("detect_chart_pattern", symbol=symbol)
            context.set_intermediate_result("technical_patterns", patterns)
            
            system_prompt = """You are a technical analysis expert. Analyze the detected patterns and provide:
1. Current technical trend
2. Support and resistance implications
3. Recommended action based on patterns
Keep response concise and actionable."""
            
            analysis_messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""Technical Patterns Detected: {json.dumps(patterns)}
Focus: {user_input}"""}
            ]
            
            llm_response = await self.ai_service.get_chat_completion(analysis_messages)
            
            execution_time_ms = (time.time() - start_time) * 1000
            self.status = AgentStatus.COMPLETED
            self.update_metrics(execution_time_ms, success=True, autonomous=True)
            
            context.add_audit_entry(
                self.name,
                "execution_complete",
                {"patterns_detected": len(patterns.get("patterns", []))},
            )
            
            return AgentResponse(
                content=llm_response,
                agent_name=self.name,
                capability=self.capability,
                confidence_score=0.8,
                status=self.status,
                tools_used=["detect_chart_pattern"],
                execution_time_ms=execution_time_ms,
                reasoning=f"Detected {len(patterns.get('patterns', []))} technical patterns autonomously.",
            )
        
        except Exception as e:
            return await self.handle_error(e, context)


class ComplianceCheckerAgent(BaseAgent):
    """Ensures all recommendations comply with regulations and risk policies"""
    
    def __init__(self, ai_service):
        super().__init__("ComplianceChecker", AgentCapability.COMPLIANCE_CHECK)
        self.ai_service = ai_service
        
        self.register_tool(Tool(
            name="check_regulatory_limits",
            description="Check if recommendation violates regulatory position limits",
            callable_func=self._check_limits,
            parameters={"recommendation": {"type": "object"}},
            required_params=["recommendation"],
        ))
    
    async def _check_limits(self, recommendation: Dict) -> Dict:
        """Autonomously check compliance limits"""
        try:
            # Simulated compliance check
            is_compliant = True
            violations = []
            
            if recommendation.get("allocation_percent", 0) > 30:
                is_compliant = False
                violations.append("Single position exceeds 30% limit")
            
            return {
                "is_compliant": is_compliant,
                "violations": violations,
                "risk_level": "low" if is_compliant else "high",
            }
        except Exception as e:
            logger.error(f"Compliance check failed: {e}")
            raise
    
    async def execute(self, context: AgentContext, user_input: str) -> AgentResponse:
        """Check compliance with autonomous decision-making"""
        start_time = time.time()
        self.status = AgentStatus.PROCESSING
        
        try:
            context.add_audit_entry(self.name, "execution_start", {"query": user_input})
            
            recommendation = context.get_intermediate_result("recommendation", {})
            
            # Autonomous compliance check
            compliance_result = await self.invoke_tool("check_regulatory_limits", recommendation=recommendation)
            context.set_intermediate_result("compliance_status", compliance_result)
            
            # Autonomous decision: block or approve
            if not compliance_result["is_compliant"]:
                logger.warning(f"Recommendation blocked by compliance: {compliance_result['violations']}")
                context.add_audit_entry(
                    self.name,
                    "recommendation_blocked",
                    {"violations": compliance_result["violations"]},
                )
            
            system_prompt = """You are a compliance and risk officer. Analyze the compliance status and provide:
1. Compliance assessment
2. Any regulatory concerns
3. Recommendations if violations exist
Be concise and professional."""
            
            analysis_messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""Compliance Status: {json.dumps(compliance_result)}
Original Query: {user_input}"""}
            ]
            
            llm_response = await self.ai_service.get_chat_completion(analysis_messages)
            
            execution_time_ms = (time.time() - start_time) * 1000
            self.status = AgentStatus.COMPLETED
            autonomous = compliance_result["is_compliant"]
            self.update_metrics(execution_time_ms, success=True, autonomous=autonomous)
            
            return AgentResponse(
                content=llm_response,
                agent_name=self.name,
                capability=self.capability,
                confidence_score=0.95 if compliance_result["is_compliant"] else 0.90,
                status=self.status,
                tools_used=["check_regulatory_limits"],
                execution_time_ms=execution_time_ms,
                reasoning=f"Compliance check: {compliance_result['risk_level']} risk, autonomous={'approved' if autonomous else 'blocked'}.",
            )
        
        except Exception as e:
            return await self.handle_error(e, context)


class NewsAnalyzerAgent(BaseAgent):
    """Analyzes financial news and market intelligence"""
    
    def __init__(self, ai_service):
        super().__init__("NewsAnalyzer", AgentCapability.NEWS_ANALYSIS)
        self.ai_service = ai_service
    
    async def execute(self, context: AgentContext, user_input: str) -> AgentResponse:
        """Analyze news with structured reasoning"""
        start_time = time.time()
        self.status = AgentStatus.PROCESSING
        
        try:
            context.add_audit_entry(self.name, "execution_start", {"query": user_input})
            
            system_prompt = """You are a financial news analyst. Analyze the market news and provide:
1. Key events and their market impact
2. Affected sectors and companies
3. Investment implications
4. Risk assessment
Be specific, data-driven, and professional."""
            
            analysis_messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
            
            llm_response = await self.ai_service.get_chat_completion(analysis_messages)
            
            execution_time_ms = (time.time() - start_time) * 1000
            self.status = AgentStatus.COMPLETED
            self.update_metrics(execution_time_ms, success=True, autonomous=True)
            
            context.add_audit_entry(
                self.name,
                "execution_complete",
                {"analysis_length": len(llm_response)},
            )
            
            return AgentResponse(
                content=llm_response,
                agent_name=self.name,
                capability=self.capability,
                confidence_score=0.82,
                status=self.status,
                execution_time_ms=execution_time_ms,
                reasoning="Analyzed news with focus on market impact and investment implications.",
            )
        
        except Exception as e:
            return await self.handle_error(e, context)
