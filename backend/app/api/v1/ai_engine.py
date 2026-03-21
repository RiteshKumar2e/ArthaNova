"""
Enterprise AI Engine API with Multi-Agent Orchestration
Implements: Autonomy, Multi-Agent Design, Compliance, Observability
"""

import asyncio
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, ChatSession, ChatMessage
from app.schemas.schemas import ChatMessageRequest, ChatMessageResponse, MessageResponse
from app.services.ai_service import ai_service
from app.ai.safety_guardrails import input_validator, rate_limiter

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

import logging
logger = logging.getLogger(__name__)


@router.post("/chat")
async def send_chat_message(
    data: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Send a message to the AI and get a multi-agent orchestrated response.
    Features: Multi-agent autonomy, compliance, rate limiting, input validation
    """
    try:
        # Input validation (safety guardrails)
        valid, error, sanitized_input = input_validator.validate_query(data.message)
        if not valid:
            logger.warning(f"Input validation failed for user {current_user.id}: {error}")
            raise HTTPException(status_code=400, detail=error)
        
        # Rate limiting
        can_proceed, rate_error = await rate_limiter.check_rate_limit(current_user.id)  # type: ignore
        if not can_proceed:
            logger.warning(f"Rate limit exceeded for user {current_user.id}")
            raise HTTPException(status_code=429, detail=rate_error)
        
        # Get or create session
        session = None
        if data.session_id:
            result = await db.execute(
                select(ChatSession).where(
                    ChatSession.id == data.session_id,
                    ChatSession.user_id == current_user.id,
                )
            )
            session = result.scalar_one_or_none()
        
        if not session:
            session = ChatSession(
                user_id=current_user.id,
                title=sanitized_input[:60] + ("..." if len(sanitized_input) > 60 else ""),
            )
            db.add(session)
            await db.flush()
        
        # Store user message
        user_msg = ChatMessage(session_id=session.id, role="user", content=sanitized_input)
        db.add(user_msg)
        await db.commit()
        
        # Fetch chat history for context (last 6 messages)
        history_result = await db.execute(
            select(ChatMessage).where(ChatMessage.session_id == session.id)
            .order_by(ChatMessage.created_at.desc())
            .limit(6)
        )
        history = history_result.scalars().all()
        
        # Format for LLM
        messages = [
            {"role": "system", "content": "You are ArthaNova AI, an expert Indian stock market analyst. Provide concise, professional, and data-driven insights. Always include risk disclaimers for financial recommendations."}
        ]
        messages.extend([{"role": str(m.role), "content": str(m.content)} for m in reversed(history)])
        
        # MULTI-AGENT ORCHESTRATION
        # Use orchestrator for intelligent routing and multi-agent response
        orchestration_result = await ai_service.orchestrate_query(
            user_id=current_user.id,  # type: ignore
            user_input=sanitized_input,
            session_id=session.id if session else None,  # type: ignore
            portfolio_data={"holdings": []},  # Can be enhanced with actual portfolio data
        )
        
        if orchestration_result.get("success"):
            ai_text = orchestration_result.get("final_response", "Unable to generate response")
            agent_responses = orchestration_result.get("agent_responses", {})
        else:
            # Fallback to direct LLM if orchestration fails
            ai_text = await ai_service.get_chat_completion(messages, user_id=current_user.id)  # type: ignore
            agent_responses = {}
        
        # Generate sources from agent responses
        sources = []
        for agent_name, response in agent_responses.items():
            sources.append({
                "type": "agent",
                "agent": agent_name,
                "title": f"{agent_name} Analysis",
                "confidence": response.get("confidence_score", "N/A"),
                "date": datetime.now(timezone.utc).isoformat(),
            })
        
        if not sources:
            sources = [
                {"type": "filing", "title": "NSE Filings", "date": datetime.now(timezone.utc).isoformat()},
                {"type": "technical", "title": "Technical Analysis", "date": datetime.now(timezone.utc).isoformat()},
            ]
        
        # Store AI response
        ai_msg = ChatMessage(
            session_id=session.id,
            role="assistant",
            content=ai_text,
            sources=sources,
            orchestration=orchestration_result if orchestration_result.get("success") else None,
        )
        db.add(ai_msg)
        await db.commit()
        await db.refresh(ai_msg)
        
        logger.info(f"Chat message processed for user {current_user.id} in session {session.id}")
        
        return {
            "session_id": session.id,
            "message_id": ai_msg.id,
            "role": "assistant",
            "content": ai_text,
            "sources": sources,
            "agents_used": list(agent_responses.keys()) if agent_responses else [],
            "orchestration": orchestration_result if orchestration_result.get("success") else None,
            "created_at": ai_msg.created_at or datetime.now(timezone.utc),
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error processing chat message for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)[:100]}")


@router.get("/chat/sessions")
async def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all chat sessions for the current user"""
    try:
        result = await db.execute(
            select(ChatSession).where(ChatSession.user_id == current_user.id)
            .order_by(ChatSession.created_at.desc())
        )
        sessions = result.scalars().all()
        return [
            {"id": s.id, "title": s.title, "created_at": s.created_at, "updated_at": s.updated_at}
            for s in sessions
        ]
    except Exception as e:
        logger.exception(f"Error fetching sessions for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching sessions")


@router.get("/chat/sessions/{session_id}")
async def get_session_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all messages in a chat session with full context"""
    try:
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.id == session_id, ChatSession.user_id == current_user.id
            )
        )
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        messages_result = await db.execute(
            select(ChatMessage).where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
        )
        messages = messages_result.scalars().all()
        return {
            "session": {"id": session.id, "title": session.title},
            "messages": [
                {
                    "id": m.id, 
                    "role": m.role, 
                    "content": m.content, 
                    "sources": m.sources, 
                    "orchestration": m.orchestration,
                    "created_at": m.created_at
                }
                for m in messages
            ],
        }
    except Exception as e:
        logger.exception(f"Error fetching session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching session")


@router.delete("/chat/sessions/{session_id}", response_model=MessageResponse)
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a chat session (cascades to all messages)"""
    try:
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.id == session_id, ChatSession.user_id == current_user.id
            )
        )
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        await db.delete(session)
        await db.commit()
        
        logger.info(f"Session {session_id} deleted for user {current_user.id}")
        return MessageResponse(message="Session deleted successfully")
    
    except Exception as e:
        logger.exception(f"Error deleting session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Error deleting session")


@router.get("/opportunity-radar")
async def get_opportunity_radar(current_user: User = Depends(get_current_user)):
    """
    Get AI-generated investment opportunity signals using multi-agent analysis.
    Features: Parallel agent execution, autonomy, compliance
    """
    try:
        signals = []
        stocks = ["RELIANCE", "TCS", "BAJFINANCE", "SUNPHARMA", "ADANIENT", "TATASTEEL"]
        
        async def analyze_opportunity(stock: str, index: int):
            """Analyze single opportunity with AI service"""
            try:
                # Orchestrate analysis for this stock
                analysis = await ai_service.orchestrate_query(
                    user_id=current_user.id,  # type: ignore
                    user_input=f"Provide investment opportunity analysis for {stock}",
                    portfolio_data={"holdings": []},
                )
                
                # Extract results
                is_bullish = "bullish" in analysis.get("final_response", "").lower()
                confidence = 75 if is_bullish else 65
                
                return {
                    "id": index + 1,
                    "symbol": stock,
                    "signal_type": "AI-Generated Opportunity",
                    "sentiment": "Bullish" if is_bullish else "Neutral",
                    "confidence_score": confidence,
                    "expected_return_pct": 12.5 if is_bullish else 5.0,
                    "timeframe": "Medium-term (1-3 months)",
                    "summary": analysis.get("final_response", "Analysis unavailable")[:200],
                    "agents_used": list(analysis.get("agent_responses", {}).keys()),
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
            except Exception as e:
                logger.warning(f"Error analyzing {stock}: {e}")
                return {
                    "id": index + 1,
                    "symbol": stock,
                    "signal_type": "Analysis Pending",
                    "sentiment": "Neutral",
                    "confidence_score": 0,
                    "expected_return_pct": 0,
                    "timeframe": "Unknown",
                    "summary": f"Error: {str(e)[:100]}",
                    "agents_used": [],
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
        
        # Process multiple stocks in parallel (autonomy through concurrency)
        tasks = [analyze_opportunity(stock, i) for i, stock in enumerate(stocks[:6])]
        signals = await asyncio.gather(*tasks)
        
        logger.info(f"Opportunity radar generated for user {current_user.id} with {len(signals)} signals")
        
        return {
            "signals": signals,
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "total": len(signals),
            "analysis_method": "Multi-Agent Orchestration",
        }
    
    except Exception as e:
        logger.exception(f"Error generating opportunity radar: {e}")
        raise HTTPException(status_code=500, detail="Error generating signals")


@router.get("/chart-patterns/{symbol}")
async def get_chart_patterns(
    symbol: str,
    current_user: User = Depends(get_current_user),
):
    """Get AI-detected chart patterns for a stock using specialist agent"""
    try:
        # Validate symbol
        valid, error = input_validator.validate_symbol(symbol)
        if not valid:
            raise HTTPException(status_code=400, detail=error)
        
        # Use technical analyzer agent
        analysis = await ai_service.orchestrate_query(
            user_id=current_user.id,  # type: ignore
            user_input=f"Analyze technical chart patterns for {symbol.upper()}",
            portfolio_data={"holdings": []},
        )
        
        logger.info(f"Chart patterns analyzed for {symbol} by user {current_user.id}")
        
        return {
            "symbol": symbol.upper(),
            "summary": analysis.get("final_response", "Pattern analysis unavailable"),
            "agents_used": list(analysis.get("agent_responses", {}).keys()),
            "overall_signal": "Buy" if "bullish" in analysis.get("final_response", "").lower() else "Neutral",
            "analysis_method": "Multi-Agent Technical Analysis",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error analyzing chart patterns for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing patterns")


@router.get("/system-status")
async def get_system_status(
    current_user: User = Depends(get_current_user),
):
    """Get AI system status and metrics (observability)"""
    try:
        status = ai_service.get_system_status()
        metrics = ai_service.get_metrics()
        
        return {
            "system_status": status,
            "metrics": metrics,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        logger.exception(f"Error getting system status: {e}")
        raise HTTPException(status_code=500, detail="Error getting status")


@router.get("/high-conviction-trades")
async def get_high_conviction_trades(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    🔥 High Conviction Trades - Get multi-agent confirmed buyable opportunities
    
    Returns signals that passed ALL filters:
    - 3+ agent confirmations
    - Confidence >= 60%
    - Risk-Reward ratio >= 1:2
    - Probability >= 60%
    """
    try:
        # Sample high-conviction stocks to analyze
        # In production, this would query market data API
        stocks_to_analyze = ["RELIANCE", "TCS", "BAJFINANCE", "SUNPHARMA", "ADANIENT", "INFY", "WIPRO", "HDFC"]
        
        # Mock market data with multi-agent signals
        market_data = {
            stock: {
                "symbol": stock,
                "current_price": 100 + hash(stock) % 50,  # Mock price
                "target_price": 110 + hash(stock) % 60,
                "stop_loss": 90 + hash(stock) % 40,
                "technical_signal": "BUY" if hash(stock) % 2 == 0 else "NEUTRAL",
                "technical_confidence": 70 + hash(stock) % 30,
                "technical_strength": 75,
                "technical_reasoning": f"Strong breakout pattern on {stock}",
                "fundamental_signal": "BUY" if hash(stock) % 3 == 0 else "HOLD",
                "fundamental_confidence": 65 + hash(stock) % 25,
                "fundamental_strength": 70,
                "fundamental_reasoning": f"Positive Q3 earnings for {stock}",
                "sentiment_signal": "BUY" if hash(stock) % 4 != 0 else "NEUTRAL",
                "sentiment_confidence": 60 + hash(stock) % 25,
                "sentiment_strength": 65,
                "sentiment_reasoning": f"Positive news flow around {stock}",
                "risk_signal": "BUY" if hash(stock) % 5 == 0 else "HOLD",
                "risk_confidence": 65 + hash(stock) % 20,
                "risk_strength": 60,
                "risk_reasoning": f"Low volatility environment for {stock}",
                "diversification_impact": f"Sector: {['Technology', 'Finance', 'Industrial'][hash(stock) % 3]}"
            }
            for stock in stocks_to_analyze
        }
        
        # Get high-conviction signals from decision engine
        trade_signals_result = await ai_service.get_high_conviction_trades(
            stock_symbols=stocks_to_analyze,
            marketdata=market_data,
            user_holdings={},  # Could fetch from user portfolio
        )
        
        # Format for frontend
        high_conviction_trades = {
            "buy_signals": [s.to_dict() for s in trade_signals_result.get("buy_signals", [])],
            "sell_signals": [s.to_dict() for s in trade_signals_result.get("sell_signals", [])],
        }
        
        logger.info(
            f"High-conviction trades generated for user {current_user.id}: "
            f"{len(high_conviction_trades['buy_signals'])} BUY, "
            f"{len(high_conviction_trades['sell_signals'])} SELL"
        )
        
        return {
            "buy_signals": high_conviction_trades["buy_signals"],
            "sell_signals": high_conviction_trades["sell_signals"],
            "total_signals": len(high_conviction_trades["buy_signals"]) + len(high_conviction_trades["sell_signals"]),
            "confidence_threshold": "60%+",
            "confirmations_required": "3+ agents",
            "min_rr_ratio": "1:2",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
    
    except Exception as e:
        logger.exception(f"Error generating high-conviction trades for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating trades: {str(e)[:100]}")


@router.get("/risk-alerts")
async def get_risk_alerts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    ⚠️ Risk Alerts Panel - Get portfolio and market risks
    
    Returns:
    - Portfolio concentration risks
    - Bearish signals with low probability
    - High volatility warnings
    - Conflicting multi-agent signals
    """
    try:
        # Sample risk analysis
        stocks_to_analyze = ["RELIANCE", "TCS", "BAJFINANCE", "SUNPHARMA", "ADANIENT", "INFY", "WIPRO", "HDFC"]
        
        market_data = {
            stock: {
                "symbol": stock,
                "current_price": 100 + hash(stock) % 50,
                "volatility": 20 + hash(stock) % 30,
                "technical_signal": "SELL" if hash(stock) % 5 == 0 else "NEUTRAL",
                "technical_confidence": 55 + hash(stock) % 20,
                "technical_reasoning": f"Weakening momentum on {stock}",
                "sentiment_signal": "SELL" if hash(stock) % 6 == 0 else "NEUTRAL",
                "sentiment_confidence": 50 + hash(stock) % 15,
                "sentiment_reasoning": f"Negative market sentiment on {stock}",
                "risk_signal": "SELL" if hash(stock) % 7 == 0 else "NEUTRAL",
                "risk_confidence": 65 + hash(stock) % 20,
                "risk_reasoning": f"High risk exposure in {stock}",
            }
            for stock in stocks_to_analyze
        }
        
        # Get risk alerts from decision engine
        trade_signals_result = await ai_service.get_high_conviction_trades(
            stock_symbols=stocks_to_analyze,
            marketdata=market_data,
            user_holdings={},
        )
        
        risk_alerts = [s.to_dict() for s in trade_signals_result.get("risk_alerts", [])]
        
        # Add portfolio-level risks
        portfolio_risks = [
            {
                "type": "concentration",
                "level": "medium",
                "description": "Tech sector concentration above 25% threshold",
                "action": "Rebalance into underweighted sectors",
                "priority": 2,
            },
            {
                "type": "market_condition",
                "level": "low",
                "description": "Overall market volatility elevated (VIX equivalent: 28)",
                "action": "Consider reducing position sizes or hedging",
                "priority": 3,
            },
        ]
        
        logger.info(
            f"Risk alerts generated for user {current_user.id}: "
            f"{len(risk_alerts)} stock alerts, {len(portfolio_risks)} portfolio alerts"
        )
        
        return {
            "stock_alerts": risk_alerts,
            "portfolio_risks": portfolio_risks,
            "total_alerts": len(risk_alerts) + len(portfolio_risks),
            "alert_status": "ACTIVE" if (len(risk_alerts) + len(portfolio_risks)) > 0 else "CLEAR",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
    
    except Exception as e:
        logger.exception(f"Error generating risk alerts for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating alerts: {str(e)[:100]}")
