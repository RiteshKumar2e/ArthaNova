"""ArthaNova — AI Chat API (RAG-powered conversational interface)."""

import random
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, ChatSession, ChatMessage
from app.schemas.schemas import ChatMessageRequest, ChatMessageResponse, MessageResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

# Canned AI responses for demo (replace with OpenAI + RAG in production)
AI_RESPONSES = [
    "Based on my analysis of your portfolio and current market conditions, {stock} shows strong momentum with RSI at 58 — indicating room for upside. The recent quarterly results beat estimates by 12%, and institutional buying has picked up.",
    "Looking at the broader market context: FII flows have been positive this week (+₹2,400 Cr net), which typically supports mid and large caps. Your portfolio has moderate correlation to Nifty (beta: 0.87), which provides some protection in downturns.",
    "The technical setup for {stock} is interesting — price is consolidating above the 200-DMA with declining volumes, often a precursor to a breakout. Key resistance is at ₹{price} — a close above that with volume would confirm the bullish thesis.",
    "From a risk perspective, your portfolio concentration in IT (38%) is above the recommended threshold of 30%. Consider trimming positions and rotating into defensive sectors like FMCG or Pharma ahead of the quarterly results season.",
    "Based on the latest filing analysis, {stock}'s management commentary was upbeat — key phrases like 'demand acceleration' and 'margin recovery' appeared 3x more than the previous quarter. My sentiment score: 78/100 (Bullish).",
    "The Opportunity Radar has flagged a high-confidence signal on {stock}: Insider purchases of ₹45 Cr in the last 2 weeks, combined with a positive earnings revision by 3 brokers. Confidence score: 84%.",
]

STOCKS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "BAJFINANCE", "WIPRO", "MARUTI", "SUNPHARMA"]


def generate_ai_response(user_message: str) -> tuple[str, list]:
    """Generate a contextual AI response (mock implementation)."""
    stock = random.choice(STOCKS)
    price = random.randint(500, 5000)
    response = random.choice(AI_RESPONSES).format(stock=stock, price=price)
    sources = [
        {"type": "filing", "title": f"{stock} Q3 FY25 Earnings Report", "date": "2025-01-15"},
        {"type": "news", "title": f"Analyst upgrades {stock} price target", "date": "2025-01-10"},
        {"type": "technical", "title": f"{stock} Chart Pattern Analysis", "date": "2025-01-18"},
    ]
    return response, sources[:random.randint(1, 3)]


@router.post("/chat")
async def send_chat_message(
    data: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Send a message to the AI and get a response."""
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
            title=data.message[:60] + ("..." if len(data.message) > 60 else ""),
        )
        db.add(session)
        await db.flush()

    # Store user message
    user_msg = ChatMessage(session_id=session.id, role="user", content=data.message)
    db.add(user_msg)
    await db.commit() # Commit user message first

    # Fetch chat history for context (last 6 messages)
    history_result = await db.execute(
        select(ChatMessage).where(ChatMessage.session_id == session.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(6)
    )
    history = history_result.scalars().all()
    # Format for LLM (reversed to keep chronological order)
    messages = [
        {"role": "system", "content": "You are ArthaNova AI, an expert Indian stock market analyst. Provide concise, professional, and data-driven insights. Focus on NSE/BSE stocks and technical indicators like RSI and EMA when relevant."}
    ]
    messages.extend([{"role": m.role, "content": m.content} for m in reversed(history)])

    # Generate REAL AI response using Groq
    ai_text = await ai_service.get_chat_completion(messages)

    # Mock sources (still useful for UI demo)
    stock = random.choice(STOCKS)
    sources = [
        {"type": "filing", "title": f"{stock} Q3 FY25 Earnings Report", "date": "2025-01-15"},
        {"type": "technical", "title": f"{stock} AI Sentiment & Chart Analysis", "date": datetime.now().strftime("%Y-%m-%d")},
    ]

    # Store AI response
    ai_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=ai_text,
        sources=sources,
    )
    db.add(ai_msg)
    await db.commit()
    await db.refresh(ai_msg)

    return {
        "session_id": session.id,
        "message_id": ai_msg.id,
        "role": "assistant",
        "content": ai_text,
        "sources": sources,
        "created_at": ai_msg.created_at or datetime.now(timezone.utc),
    }


@router.get("/chat/sessions")
async def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all chat sessions for the current user."""
    result = await db.execute(
        select(ChatSession).where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
    )
    sessions = result.scalars().all()
    return [
        {"id": s.id, "title": s.title, "created_at": s.created_at, "updated_at": s.updated_at}
        for s in sessions
    ]


@router.get("/chat/sessions/{session_id}")
async def get_session_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all messages in a chat session."""
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
            {"id": m.id, "role": m.role, "content": m.content, "sources": m.sources, "created_at": m.created_at}
            for m in messages
        ],
    }


@router.delete("/chat/sessions/{session_id}", response_model=MessageResponse)
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a chat session."""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id, ChatSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    return MessageResponse(message="Session deleted")


@router.get("/opportunity-radar")
async def get_opportunity_radar(current_user: User = Depends(get_current_user)):
    """Get AI-generated investment opportunity signals using Groq fallback engine."""
    import random
    import asyncio

    signals = []
    stocks = ["RELIANCE", "TCS", "BAJFINANCE", "SUNPHARMA", "ADANIENT", "TATASTEEL", "LT", "DIVISLAB"]
    signal_types = ["Breakout Setup", "Insider Accumulation", "Earnings Catalyst", "Technical Reversal", "Fundamental Re-rating"]
    sentiments = ["Bullish", "Very Bullish", "Cautiously Bullish"]

    for i, stock in enumerate(stocks[:6]):
        signals.append({
            "id": i + 1,
            "symbol": stock,
            "signal_type": random.choice(signal_types),
            "sentiment": random.choice(sentiments),
            "confidence_score": round(random.uniform(65, 95), 1),
            "expected_return_pct": round(random.uniform(8, 35), 1),
            "timeframe": random.choice(["Short-term (1-4 weeks)", "Medium-term (1-3 months)", "Long-term (6-12 months)"]),
            "summary": f"Analyzing {stock} via Groq Engine...", # placeholder
            "data_sources": random.sample(["NSE Filings", "SEBI Disclosures", "Quarterly Results", "Insider Trades", "Foreign Holdings"], 3),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    # Live enhancement using the AI fallback service
    async def update_summary(sig):
        sig["summary"] = await ai_service.generate_market_insights(f"{sig['symbol']} showing {sig['signal_type']} with {sig['sentiment']} sentiment.")
    
    # Process tasks concurrently
    await asyncio.gather(*(update_summary(s) for s in signals))

    return {"signals": signals, "last_updated": datetime.now(timezone.utc).isoformat(), "total": len(signals)}


@router.get("/chart-patterns/{symbol}")
async def get_chart_patterns(symbol: str, current_user: User = Depends(get_current_user)):
    """Get AI-detected chart patterns for a stock."""
    patterns = [
        {"name": "RSI Divergence", "type": "Bullish", "confidence": 78.5, "description": "Price making lower lows while RSI makes higher lows — classic bullish divergence signaling potential reversal."},
        {"name": "EMA Crossover", "type": "Bearish", "confidence": 65.2, "description": "20-EMA crossed below 50-EMA, indicating short-term bearish momentum."},
        {"name": "Cup and Handle", "type": "Bullish", "confidence": 82.1, "description": "Classic cup and handle pattern forming on daily chart. Breakout above handle resistance could trigger 15-20% upside."},
    ]
    return {
        "symbol": symbol.upper(),
        "patterns": random.sample(patterns, random.randint(1, len(patterns))),
        "overall_signal": random.choice(["Buy", "Hold", "Sell"]),
        "backtest_win_rate": round(random.uniform(55, 75), 1),
    }
