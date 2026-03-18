"""ArthaNova — News, IPO, Insider, and Deals API routers."""

import random
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Query
from app.core.dependencies import get_current_user
from fastapi import Depends
from app.models.user import User

# ─── News Router ───────────────────────────────────────────────────────────────
news_router = APIRouter(prefix="/news", tags=["News Intelligence"])

NEWS_DATA = [
    {"id": 1, "headline": "RBI holds repo rate at 6.5%; signals accommodative stance for growth", "source": "Economic Times", "sector": "Banking", "sentiment": "Positive", "sentiment_score": 0.72, "tags": ["RBI", "Monetary Policy", "Banking"]},
    {"id": 2, "headline": "Reliance Industries Q3 profit up 12% YoY, beats analyst estimates", "source": "Business Standard", "sector": "Energy", "sentiment": "Positive", "sentiment_score": 0.84, "tags": ["RELIANCE", "Earnings", "Oil & Gas"]},
    {"id": 3, "headline": "FII outflows continue for third consecutive week amid global uncertainty", "source": "Mint", "sector": "Markets", "sentiment": "Negative", "sentiment_score": -0.55, "tags": ["FII", "Markets", "Global"]},
    {"id": 4, "headline": "IT sector faces headwinds as US tech spending slows; TCS, Infosys under watch", "source": "NDTV Profit", "sector": "IT", "sentiment": "Negative", "sentiment_score": -0.42, "tags": ["TCS", "INFY", "IT Sector"]},
    {"id": 5, "headline": "Adani Green Energy secures ₹12,000 Cr project from SECI for solar capacity", "source": "Reuters", "sector": "Renewable Energy", "sentiment": "Positive", "sentiment_score": 0.79, "tags": ["ADANIGREEN", "Solar", "Renewable"]},
    {"id": 6, "headline": "Bajaj Finance raises concerns over asset quality; provisions increase 18%", "source": "Moneycontrol", "sector": "NBFC", "sentiment": "Negative", "sentiment_score": -0.61, "tags": ["BAJFINANCE", "NBFC", "Asset Quality"]},
    {"id": 7, "headline": "Nifty 50 eyes 22,500 as global cues positive; IT stocks lead gains", "source": "LiveMint", "sector": "Markets", "sentiment": "Positive", "sentiment_score": 0.68, "tags": ["NIFTY", "Bull Market", "IT"]},
    {"id": 8, "headline": "SEBI proposes new framework for algo trading; retail investors to benefit", "source": "Economic Times", "sector": "Regulatory", "sentiment": "Neutral", "sentiment_score": 0.15, "tags": ["SEBI", "Regulation", "Algo Trading"]},
]

@news_router.get("/")
async def get_news(
    sector: str = Query(None),
    sentiment: str = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
):
    items = NEWS_DATA.copy()
    if sector:
        items = [n for n in items if n["sector"].lower() == sector.lower()]
    if sentiment:
        items = [n for n in items if n["sentiment"].lower() == sentiment.lower()]

    # Add timestamps
    now = datetime.now(timezone.utc)
    for i, item in enumerate(items):
        item["published_at"] = (now - timedelta(hours=i * 2 + random.randint(0, 3))).isoformat()
        item["summary"] = f"AI Summary: {item['headline']}. Market participants are closely tracking this development given its potential impact on sector valuations and investor sentiment."

    start = (page - 1) * per_page
    return {
        "items": items[start:start + per_page],
        "total": len(items),
        "page": page,
        "per_page": per_page,
    }


@news_router.get("/sentiment-summary")
async def get_sentiment_summary():
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
