"""ArthaNova — Stocks API router with market data."""

import random
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user, get_optional_user
from app.models.user import User

router = APIRouter(prefix="/stocks", tags=["Stocks & Market Data"])

# Mock data for demo — replace with real NSE/BSE API integration
NIFTY50_STOCKS = [
    {"symbol": "RELIANCE", "name": "Reliance Industries", "sector": "Energy", "market_cap": 1850000},
    {"symbol": "TCS", "name": "Tata Consultancy Services", "sector": "IT", "market_cap": 1420000},
    {"symbol": "HDFCBANK", "name": "HDFC Bank", "sector": "Banking", "market_cap": 1240000},
    {"symbol": "INFY", "name": "Infosys", "sector": "IT", "market_cap": 670000},
    {"symbol": "ICICIBANK", "name": "ICICI Bank", "sector": "Banking", "market_cap": 780000},
    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever", "sector": "FMCG", "market_cap": 560000},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance", "sector": "NBFC", "market_cap": 460000},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank", "sector": "Banking", "market_cap": 390000},
    {"symbol": "LT", "name": "Larsen & Toubro", "sector": "Infrastructure", "market_cap": 440000},
    {"symbol": "ASIANPAINT", "name": "Asian Paints", "sector": "Consumer", "market_cap": 250000},
    {"symbol": "WIPRO", "name": "Wipro", "sector": "IT", "market_cap": 280000},
    {"symbol": "MARUTI", "name": "Maruti Suzuki", "sector": "Auto", "market_cap": 320000},
    {"symbol": "AXISBANK", "name": "Axis Bank", "sector": "Banking", "market_cap": 350000},
    {"symbol": "TATAMOTORS", "name": "Tata Motors", "sector": "Auto", "market_cap": 290000},
    {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical", "sector": "Pharma", "market_cap": 370000},
    {"symbol": "ONGC", "name": "Oil & Natural Gas Corp", "sector": "Energy", "market_cap": 310000},
    {"symbol": "NTPC", "name": "NTPC", "sector": "Power", "market_cap": 220000},
    {"symbol": "POWERGRID", "name": "Power Grid Corp", "sector": "Power", "market_cap": 200000},
    {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking", "market_cap": 600000},
    {"symbol": "ADANIENT", "name": "Adani Enterprises", "sector": "Conglomerate", "market_cap": 280000},
    {"symbol": "ULTRACEMCO", "name": "UltraTech Cement", "sector": "Cement", "market_cap": 240000},
    {"symbol": "TATASTEEL", "name": "Tata Steel", "sector": "Metals", "market_cap": 185000},
    {"symbol": "JSWSTEEL", "name": "JSW Steel", "sector": "Metals", "market_cap": 175000},
    {"symbol": "M&M", "name": "Mahindra & Mahindra", "sector": "Auto", "market_cap": 195000},
    {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv", "sector": "Financial Services", "market_cap": 225000},
    {"symbol": "HCLTECH", "name": "HCL Technologies", "sector": "IT", "market_cap": 340000},
    {"symbol": "DIVISLAB", "name": "Divi's Laboratories", "sector": "Pharma", "market_cap": 145000},
    {"symbol": "DRREDDY", "name": "Dr. Reddy's Labs", "sector": "Pharma", "market_cap": 130000},
    {"symbol": "CIPLA", "name": "Cipla", "sector": "Pharma", "market_cap": 125000},
    {"symbol": "TITAN", "name": "Titan Company", "sector": "Consumer", "market_cap": 270000},
]


def get_mock_quote(symbol: str, base_data: dict) -> dict:
    """Generate realistic mock stock quote."""
    base_price = (base_data["market_cap"] / 1000) * (0.8 + random.random() * 0.4)
    change = (random.random() - 0.48) * base_price * 0.03
    change_pct = (change / (base_price - change)) * 100
    return {
        "symbol": symbol,
        "company_name": base_data["name"],
        "sector": base_data["sector"],
        "exchange": "NSE",
        "ltp": round(base_price, 2),
        "open": round(base_price * (0.99 + random.random() * 0.02), 2),
        "high": round(base_price * (1.0 + random.random() * 0.03), 2),
        "low": round(base_price * (0.97 + random.random() * 0.02), 2),
        "prev_close": round(base_price - change, 2),
        "change": round(change, 2),
        "change_pct": round(change_pct, 2),
        "volume": random.randint(500000, 5000000),
        "market_cap": base_data["market_cap"],
        "pe_ratio": round(15 + random.random() * 35, 1),
        "pb_ratio": round(1 + random.random() * 8, 2),
        "dividend_yield": round(random.random() * 3, 2),
        "52w_high": round(base_price * (1.1 + random.random() * 0.3), 2),
        "52w_low": round(base_price * (0.65 + random.random() * 0.2), 2),
    }


@router.get("/")
async def list_stocks(
    q: Optional[str] = Query(None, description="Search query"),
    sector: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """List all NSE stocks with optional filtering."""
    stocks = NIFTY50_STOCKS.copy()
    if q:
        q_lower = q.lower()
        stocks = [s for s in stocks if q_lower in s["symbol"].lower() or q_lower in s["name"].lower()]
    if sector:
        stocks = [s for s in stocks if s["sector"].lower() == sector.lower()]

    start = (page - 1) * per_page
    paginated = stocks[start:start + per_page]
    quotes = [get_mock_quote(s["symbol"], s) for s in paginated]

    return {
        "items": quotes,
        "total": len(stocks),
        "page": page,
        "per_page": per_page,
        "total_pages": max(1, (len(stocks) + per_page - 1) // per_page),
    }


@router.get("/market-overview")
async def market_overview():
    """Get market indices and overview."""
    return {
        "indices": [
            {"name": "NIFTY 50", "value": round(21850 + random.uniform(-300, 300), 2), "change": round(random.uniform(-200, 200), 2), "change_pct": round(random.uniform(-1.5, 1.5), 2)},
            {"name": "SENSEX", "value": round(72250 + random.uniform(-500, 500), 2), "change": round(random.uniform(-400, 400), 2), "change_pct": round(random.uniform(-1.5, 1.5), 2)},
            {"name": "NIFTY BANK", "value": round(47800 + random.uniform(-400, 400), 2), "change": round(random.uniform(-300, 300), 2), "change_pct": round(random.uniform(-1.5, 1.5), 2)},
            {"name": "NIFTY MIDCAP 100", "value": round(43200 + random.uniform(-300, 300), 2), "change": round(random.uniform(-200, 200), 2), "change_pct": round(random.uniform(-1.5, 1.5), 2)},
            {"name": "NIFTY IT", "value": round(36500 + random.uniform(-300, 300), 2), "change": round(random.uniform(-200, 200), 2), "change_pct": round(random.uniform(-1.5, 1.5), 2)},
            {"name": "NIFTY PHARMA", "value": round(17800 + random.uniform(-200, 200), 2), "change": round(random.uniform(-150, 150), 2), "change_pct": round(random.uniform(-1.5, 1.5), 2)},
        ],
        "fii_dii": {
            "fii_buy": round(random.uniform(5000, 15000), 2),
            "fii_sell": round(random.uniform(4000, 14000), 2),
            "fii_net": round(random.uniform(-5000, 5000), 2),
            "dii_buy": round(random.uniform(4000, 12000), 2),
            "dii_sell": round(random.uniform(3000, 11000), 2),
            "dii_net": round(random.uniform(-3000, 3000), 2),
        },
        "advance_decline": {
            "advances": random.randint(900, 1500),
            "declines": random.randint(500, 1100),
            "unchanged": random.randint(50, 200),
        },
        "market_breadth": "Bullish" if random.random() > 0.45 else "Bearish",
        "vix": round(12 + random.uniform(-3, 8), 2),
    }


@router.get("/sectors")
async def sector_performance():
    """Get sector-wise performance heatmap data."""
    sectors = ["IT", "Banking", "Pharma", "FMCG", "Auto", "Energy", "Metals", "Realty", "Infra", "NBFC"]
    return {
        "sectors": [
            {
                "name": s,
                "change_pct": round(random.uniform(-3.5, 3.5), 2),
                "market_cap": round(random.uniform(150000, 800000), 0),
                "top_gainer": random.choice(NIFTY50_STOCKS)["symbol"],
                "top_loser": random.choice(NIFTY50_STOCKS)["symbol"],
            }
            for s in sectors
        ]
    }


@router.get("/{symbol}")
async def get_stock_detail(symbol: str):
    """Get detailed information for a specific stock."""
    stock = next((s for s in NIFTY50_STOCKS if s["symbol"] == symbol.upper()), None)
    if not stock:
        # Return generalized mock data for any symbol
        stock = {"symbol": symbol.upper(), "name": f"{symbol.upper()} Ltd", "sector": "Mixed", "market_cap": 100000}

    quote = get_mock_quote(symbol.upper(), stock)
    quote.update({
        "description": f"{stock['name']} is a leading company in the {stock['sector']} sector listed on NSE and BSE.",
        "isin": f"INE{symbol[:3].upper()}01018",
        "face_value": 10,
        "book_value": round(quote["ltp"] / quote["pb_ratio"], 2),
        "eps": round(quote["ltp"] / quote["pe_ratio"], 2),
        "debt_to_equity": round(random.uniform(0, 2.5), 2),
        "roe": round(random.uniform(8, 35), 1),
        "roce": round(random.uniform(10, 40), 1),
        "promoter_holding": round(random.uniform(30, 75), 2),
        "fii_holding": round(random.uniform(5, 40), 2),
        "dii_holding": round(random.uniform(5, 25), 2),
        "public_holding": round(random.uniform(10, 30), 2),
        "quarterly_results": [
            {"quarter": f"Q{q} FY25", "revenue": round(random.uniform(10000, 200000), 0), "profit": round(random.uniform(1000, 20000), 0), "margin": round(random.uniform(8, 30), 1)}
            for q in range(1, 5)
        ],
        "technical": {
            "rsi_14": round(random.uniform(25, 75), 1),
            "macd": round(random.uniform(-50, 50), 2),
            "macd_signal": round(random.uniform(-50, 50), 2),
            "ema_20": round(quote["ltp"] * (0.97 + random.random() * 0.06), 2),
            "ema_50": round(quote["ltp"] * (0.93 + random.random() * 0.14), 2),
            "ema_200": round(quote["ltp"] * (0.85 + random.random() * 0.3), 2),
            "support": round(quote["ltp"] * 0.92, 2),
            "resistance": round(quote["ltp"] * 1.08, 2),
        },
        "ai_insight": {
            "sentiment": random.choice(["Bullish", "Bearish", "Neutral", "Cautiously Bullish"]),
            "confidence": round(random.uniform(55, 90), 1),
            "signal": random.choice(["Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"]),
            "summary": f"Based on technical indicators and recent fundamental data, {stock['name']} shows a moderate uptrend with strong institutional interest. Watch for breakout above resistance.",
        },
    })
    return quote


@router.get("/{symbol}/ohlcv")
async def get_ohlcv(symbol: str, period: str = Query("1y", regex="^(1d|1w|1m|3m|6m|1y|2y|5y)$")):
    """Get OHLCV candlestick data for charting."""
    import datetime
    days_map = {"1d": 1, "1w": 7, "1m": 30, "3m": 90, "6m": 180, "1y": 365, "2y": 730, "5y": 1825}
    days = days_map.get(period, 365)

    base_price = 1000 + random.uniform(500, 4000)
    data = []
    current = datetime.date.today()

    for i in range(days, 0, -1):
        date = current - datetime.timedelta(days=i)
        if date.weekday() >= 5:  # Skip weekends
            continue
        change = random.uniform(-0.025, 0.025)
        base_price *= (1 + change)
        open_price = base_price * (1 + random.uniform(-0.01, 0.01))
        high = max(base_price, open_price) * (1 + random.uniform(0, 0.02))
        low = min(base_price, open_price) * (1 - random.uniform(0, 0.02))
        close = base_price
        data.append({
            "date": str(date),
            "open": round(open_price, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(close, 2),
            "volume": random.randint(500000, 5000000),
        })

    return {"symbol": symbol.upper(), "period": period, "data": data}
