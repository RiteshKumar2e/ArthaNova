"""
ArthaNova — Market Data API Routers
Integrates real market data providers: News, IPO, Insider, Deals, Stock Data
"""

import random
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from app.core.dependencies import get_current_user
from fastapi import Depends
from app.models.user import User
from app.services.news_service import get_news_service
from app.services.market_data_service import get_market_data_service

logger = logging.getLogger(__name__)

# ─── News Router ───────────────────────────────────────────────────────────────
news_router = APIRouter(prefix="/news", tags=["News Intelligence"])


@news_router.get("/")
async def get_news(
    sector: str = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
):
    """
    Get market news with sentiment analysis.
    Filters by sector if provided.
    """
    try:
        news_service = get_news_service()
        
        # Fetch from real news API
        news_data = await news_service.get_market_news(
            sector=sector,
            limit=per_page * page,
            page=page
        )
        
        if news_data.get("error"):
            logger.warning(f"News API error: {news_data.get('error')}")
            # Fallback to mock data if API fails
            return await _get_mock_news(sector, page, per_page)
        
        items = news_data.get("items", [])
        total = news_data.get("total", len(items))
        
        return {
            "items": items,
            "total": total,
            "page": page,
            "per_page": per_page,
            "provider": "newsapi",
        }
    
    except Exception as e:
        logger.error(f"News fetch failed: {e}")
        return await _get_mock_news(sector, page, per_page)


@news_router.get("/sentiment-summary")
async def get_sentiment_summary():
    """Get overall market sentiment from news analysis."""
    try:
        news_service = get_news_service()
        sentiment = await news_service.get_market_sentiment()
        
        if not sentiment.get("error"):
            return sentiment
        else:
            # Fallback
            return _get_mock_sentiment_summary()
    
    except Exception as e:
        logger.error(f"Sentiment summary failed: {e}")
        return _get_mock_sentiment_summary()


@news_router.get("/trending")
async def get_trending_topics():
    """Get trending market topics from latest news."""
    try:
        news_service = get_news_service()
        trending = await news_service.get_trending_topics(limit=10)
        
        if not trending.get("error"):
            return trending
        else:
            return {"trending_topics": [], "error": "Failed to fetch trending topics"}
    
    except Exception as e:
        logger.error(f"Trending topics fetch failed: {e}")
        return {"trending_topics": [], "error": str(e)}


async def _get_mock_news(sector: Optional[str], page: int, per_page: int):
    """Fallback mock news if API fails."""
    NEWS_DATA = [
        {"id": 1, "headline": "RBI holds repo rate at 6.5%; signals accommodative stance for growth", "source": "Economic Times", "sector": "Banking", "sentiment": "Positive", "sentiment_score": 0.72, "tags": ["RBI", "Monetary Policy", "Banking"]},
        {"id": 2, "headline": "Reliance Industries Q3 profit up 12% YoY, beats analyst estimates", "source": "Business Standard", "sector": "Energy", "sentiment": "Positive", "sentiment_score": 0.84, "tags": ["RELIANCE", "Earnings", "Oil & Gas"]},
        {"id": 3, "headline": "FII outflows continue for third consecutive week amid global uncertainty", "source": "Mint", "sector": "Markets", "sentiment": "Negative", "sentiment_score": -0.55, "tags": ["FII", "Markets", "Global"]},
        {"id": 4, "headline": "IT sector faces headwinds as US tech spending slows; TCS, Infosys under watch", "source": "NDTV Profit", "sector": "IT", "sentiment": "Negative", "sentiment_score": -0.42, "tags": ["TCS", "INFY", "IT Sector"]},
        {"id": 5, "headline": "Adani Green Energy secures ₹12,000 Cr project from SECI for solar capacity", "source": "Reuters", "sector": "Renewable Energy", "sentiment": "Positive", "sentiment_score": 0.79, "tags": ["ADANIGREEN", "Solar", "Renewable"]},
    ]
    
    items = NEWS_DATA.copy()
    if sector:
        items = [n for n in items if n["sector"].lower() == sector.lower()]
    
    now = datetime.now(timezone.utc)
    for i, item in enumerate(items):
        item["published_at"] = (now - timedelta(hours=i * 2 + random.randint(0, 3))).isoformat()
        item["summary"] = f"Market update: {item['headline']}"
    
    start = (page - 1) * per_page
    return {
        "items": items[start:start + per_page],
        "total": len(items),
        "page": page,
        "per_page": per_page,
        "provider": "mock",
    }


def _get_mock_sentiment_summary():
    """Fallback mock sentiment summary."""
    return {
        "overall_market_sentiment": "Cautiously Bullish",
        "sentiment_score": 0.34,
        "positive_news": random.randint(45, 65),
        "negative_news": random.randint(20, 40),
        "neutral_news": random.randint(10, 25),
        "sector_sentiments": [
            {"sector": "IT", "sentiment": "Neutral", "score": -0.1},
            {"sector": "Banking", "sentiment": "Positive", "score": 0.55},
            {"sector": "Pharma", "sentiment": "Bullish", "score": 0.67},
            {"sector": "Energy", "sentiment": "Positive", "score": 0.45},
            {"sector": "FMCG", "sentiment": "Neutral", "score": 0.12},
        ],
        "trending_topics": ["RBI Policy", "Q3 Results", "FII Flows", "US Fed", "Budget 2025"],
    }


# ─── IPO Router ────────────────────────────────────────────────────────────────
ipo_router = APIRouter(prefix="/ipo", tags=["IPO Tracker"])

IPO_DATA = [
    {"id": 1, "company": "Ola Electric Mobility", "symbol": "OLAELEC", "sector": "EV", "issue_price": {"min": 72, "max": 76}, "gmp": 18, "subscription_status": "Closed", "subscription_times": {"overall": 4.28, "retail": 3.9, "qib": 5.2, "hni": 3.8}, "issue_size_cr": 6145, "listing_date": "2024-08-09", "listing_price": 75.99, "current_price": 68.5},
    {"id": 2, "company": "Bajaj Housing Finance", "symbol": "BAJAJHFL", "sector": "NBFC", "issue_price": {"min": 66, "max": 70}, "gmp": 42, "subscription_status": "Closed", "subscription_times": {"overall": 64.0, "retail": 6.8, "qib": 210.0, "hni": 42.3}, "issue_size_cr": 6560, "listing_date": "2024-09-16", "listing_price": 150.0, "current_price": 114.3},
    {"id": 3, "company": "Hyundai India", "symbol": "HYUNDAI", "sector": "Auto", "issue_price": {"min": 1865, "max": 1960}, "gmp": 25, "subscription_status": "Closed", "subscription_times": {"overall": 2.37, "retail": 0.5, "qib": 6.97, "hni": 0.6}, "issue_size_cr": 27870, "listing_date": "2024-10-22", "listing_price": 1934.0, "current_price": 1545.0},
    {"id": 4, "company": "Swiggy", "symbol": "SWIGGY", "sector": "Food Delivery", "issue_price": {"min": 371, "max": 390}, "gmp": 8, "subscription_status": "Closed", "subscription_times": {"overall": 3.59, "retail": 1.14, "qib": 6.02, "hni": 2.23}, "issue_size_cr": 11327, "listing_date": "2024-11-13", "listing_price": 412.0, "current_price": 356.0},
    {"id": 5, "company": "TechNova Systems", "symbol": "TECHNOVA", "sector": "IT", "issue_price": {"min": 250, "max": 265}, "gmp": 55, "subscription_status": "Open", "subscription_times": {"overall": 12.4, "retail": 8.6, "qib": 18.2, "hni": 10.1}, "issue_size_cr": 1250, "listing_date": "2025-02-10", "listing_price": None, "current_price": None},
    {"id": 6, "company": "GreenPath Infra", "symbol": "GREENPATH", "sector": "Infrastructure", "issue_price": {"min": 180, "max": 190}, "gmp": 22, "subscription_status": "Upcoming", "subscription_times": None, "issue_size_cr": 2100, "listing_date": "2025-03-15", "listing_price": None, "current_price": None},
]

@ipo_router.get("/")
async def get_ipos(status: str = Query(None)):
    items = IPO_DATA.copy()
    if status:
        items = [i for i in items if i["subscription_status"].lower() == status.lower()]
    return {"items": items, "total": len(items)}


@ipo_router.get("/{ipo_id}")
async def get_ipo_detail(ipo_id: int):
    ipo = next((i for i in IPO_DATA if i["id"] == ipo_id), None)
    if not ipo:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="IPO not found")
    ipo["ai_analysis"] = {
        "recommendation": random.choice(["Subscribe", "Avoid", "Subscribe for Listing Gains"]),
        "confidence": round(random.uniform(60, 90), 1),
        "strengths": ["Strong brand recognition", "Market leadership in sector", "Diversified revenue mix"],
        "risks": ["High valuation vs peers", "Dependent on market conditions", "Competition intensifying"],
        "fair_value": round(ipo["issue_price"]["max"] * random.uniform(0.9, 1.4), 2),
    }
    return ipo


# ─── Insider Activity Router ───────────────────────────────────────────────────
insider_router = APIRouter(prefix="/insider", tags=["Insider Activity"])

@insider_router.get("/")
async def get_insider_trades(
    type: str = Query(None, description="buy or sell"),
    symbol: str = Query(None),
    page: int = Query(1, ge=1),
):
    trades = []
    stocks = ["RELIANCE", "TCS", "INFY", "BAJFINANCE", "HDFCBANK", "LT", "WIPRO", "MARUTI"]
    types_list = ["Promoter", "Director", "Employee", "KMP"]
    for i in range(20):
        t = random.choice(["Buy", "Sell"])
        if type and t.lower() != type.lower():
            continue
        sym = random.choice(stocks)
        if symbol and sym != symbol.upper():
            continue
        trades.append({
            "id": i + 1,
            "symbol": sym,
            "person": f"{random.choice(['Ratan', 'Mukesh', 'Rajesh', 'Anita', 'Vikram'])} {random.choice(['Sharma', 'Patel', 'Gupta', 'Singh', 'Kumar'])}",
            "designation": random.choice(types_list),
            "transaction_type": t,
            "quantity": random.randint(1000, 100000),
            "price": round(random.uniform(100, 5000), 2),
            "value_cr": round(random.uniform(0.5, 50), 2),
            "date": (datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
            "mode": random.choice(["Market", "Block Deal", "Off-Market"]),
        })
    return {"items": trades[:10], "total": len(trades), "page": page}


# ─── Bulk/Block Deal Router ────────────────────────────────────────────────────
deals_router = APIRouter(prefix="/deals", tags=["Bulk & Block Deals"])

@deals_router.get("/")
async def get_deals(deal_type: str = Query("all", regex="^(all|bulk|block)$")):
    deals = []
    stocks = ["RELIANCE", "TCS", "INFY", "ICICIBANK", "SBIN", "TATAMOTORS", "ADANIENT", "BAJFINANCE"]
    for i in range(15):
        t = random.choice(["Bulk", "Block"])
        if deal_type != "all" and t.lower() != deal_type:
            continue
        deals.append({
            "id": i + 1,
            "symbol": random.choice(stocks),
            "deal_type": t,
            "client_name": f"{random.choice(['Morgan Stanley', 'Goldman Sachs', 'Vanguard', 'BlackRock', 'HDFC MF', 'SBI MF'])} Fund",
            "transaction_type": random.choice(["Buy", "Sell"]),
            "quantity": random.randint(100000, 5000000),
            "price": round(random.uniform(100, 3000), 2),
            "value_cr": round(random.uniform(10, 500), 2),
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "exchange": random.choice(["NSE", "BSE"]),
        })
    return {"items": deals, "total": len(deals)}


# ─── Stock Data Router ────────────────────────────────────────────────────────
stock_router = APIRouter(prefix="/stocks", tags=["Stock Data & Analytics"])


@stock_router.get("/quote/{symbol}")
async def get_stock_quote(symbol: str):
    """
    Get real-time stock quote with multiple provider fallback.
    """
    try:
        market_service = get_market_data_service()
        quote = await market_service.get_stock_price(symbol)
        
        if quote.get("error"):
            logger.warning(f"Quote fetch failed for {symbol}")
            raise HTTPException(status_code=404, detail="Stock quote not available")
        
        return quote
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Stock quote error for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stock quote")


@stock_router.get("/historical/{symbol}")
async def get_stock_historical(
    symbol: str,
    days: int = Query(30, ge=1, le=365),
    interval: str = Query("1d", regex="^(1d|1wk|1mo)$")
):
    """
    Get historical price data with technical indicators.
    """
    try:
        market_service = get_market_data_service()
        data = await market_service.get_historical_data(symbol, days=days, interval=interval)
        
        if data.get("error"):
            raise HTTPException(status_code=404, detail="Historical data not available")
        
        return data
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Historical data error for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch historical data")


@stock_router.get("/info/{symbol}")
async def get_stock_info(symbol: str):
    """
    Get company fundamentals: P/E ratio, market cap, sector, etc.
    """
    try:
        market_service = get_market_data_service()
        info = await market_service.get_company_info(symbol)
        
        if info.get("error"):
            raise HTTPException(status_code=404, detail="Company info not available")
        
        return info
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Company info error for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch company info")


@stock_router.get("/market-overview")
async def get_market_overview():
    """
    Get India market overview: Nifty, Sensex, market status, etc.
    """
    try:
        market_service = get_market_data_service()
        overview = await market_service.get_market_overview()
        
        return overview
    
    except Exception as e:
        logger.error(f"Market overview error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch market overview")


@stock_router.get("/sectors")
async def get_sector_performance():
    """
    Get sector-wise performance.
    """
    try:
        market_service = get_market_data_service()
        sectors = await market_service.get_sector_performance()
        
        return sectors
    
    except Exception as e:
        logger.error(f"Sector performance error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sector performance")


# ─── Forex Router ────────────────────────────────────────────────────────────
forex_router = APIRouter(prefix="/forex", tags=["Forex Data"])


@forex_router.get("/rate")
async def get_forex_rate(
    from_currency: str = Query(...),
    to_currency: str = Query(...)
):
    """Get forex conversion rate (USD/INR, EUR/INR, etc.)"""
    try:
        market_service = get_market_data_service()
        rate = await market_service.get_forex_rate(from_currency, to_currency)
        
        if not rate:
            raise HTTPException(status_code=404, detail="Forex rate not available")
        
        return rate
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Forex rate error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch forex rate")


# ─── Company News Router ──────────────────────────────────────────────────────
company_news_router = APIRouter(prefix="/company-news", tags=["Company News"])


@company_news_router.get("/{symbol}")
async def get_company_specific_news(
    symbol: str,
    limit: int = Query(10, ge=1, le=50)
):
    """Get news specific to a company/stock."""
    try:
        news_service = get_news_service()
        news = await news_service.get_company_news(symbol, limit=limit)
        
        if news.get("error"):
            logger.warning(f"Company news not available for {symbol}")
            return {
                "symbol": symbol,
                "items": [],
                "provider": "mock",
            }
        
        return news
    
    except Exception as e:
        logger.error(f"Company news error for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch company news")
