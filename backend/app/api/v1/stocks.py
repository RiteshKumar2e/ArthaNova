"""ArthaNova — Stocks & Market Data API router."""

import random
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Query, HTTPException, Depends
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/stocks", tags=["Stocks & Market Data"])

# ─── Mock Data ───────────────────────────────────────────────────────────────

STOCKS_DB = [
    {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "sector": "Energy", "price": 2450.75, "change": 12.5, "change_pct": 0.51},
    {"symbol": "TCS", "name": "Tata Consultancy Services", "sector": "IT", "price": 3820.40, "change": -45.2, "change_pct": -1.17},
    {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "sector": "Banking", "price": 1680.15, "change": 18.3, "change_pct": 1.1},
    {"symbol": "INFY", "name": "Infosys Ltd.", "sector": "IT", "price": 1540.60, "change": -12.4, "change_pct": -0.8},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd.", "sector": "Banking", "price": 1020.45, "change": 5.2, "change_pct": 0.51},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd.", "sector": "NBFC", "price": 7250.00, "change": 105.0, "change_pct": 1.47},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd.", "sector": "Telecom", "price": 1120.30, "change": -2.1, "change_pct": -0.19},
    {"symbol": "SBIN", "name": "State Bank of India", "sector": "Banking", "price": 760.80, "change": 14.2, "change_pct": 1.9},
    {"symbol": "LT", "name": "Larsen & Toubro Ltd.", "sector": "Infrastructure", "price": 3450.00, "change": 25.0, "change_pct": 0.73},
    {"symbol": "ITC", "name": "ITC Ltd.", "sector": "FMCG", "price": 440.25, "change": -1.5, "change_pct": -0.34},
]

SECTORS_DATA = [
    {"name": "IT", "change_pct": -0.8},
    {"name": "Banking", "change_pct": 1.2},
    {"name": "Energy", "change_pct": 0.5},
    {"name": "Auto", "change_pct": 1.5},
    {"name": "FMCG", "change_pct": -0.2},
    {"name": "Pharma", "change_pct": 0.7},
]

# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/")
async def list_stocks(
    query: Optional[str] = Query(None),
    sector: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """List all stocks with filtering."""
    filtered = STOCKS_DB
    if query:
        q = query.upper()
        filtered = [s for s in filtered if q in str(s["symbol"]) or query.lower() in str(s["name"]).lower()]
    if sector:
        s_lower = sector.lower()
        filtered = [s for s in filtered if str(s["sector"]).lower() == s_lower]
    
    return {
        "stocks": filtered[offset:offset+limit],
        "total": len(filtered),
        "limit": limit,
        "offset": offset
    }

@router.get("/market-overview")
async def get_market_overview():
    """Get high-level market statistics and indices."""
    return {
        "indices": [
            {"name": "NIFTY 50", "value": 22450.15, "change": 112.4, "change_pct": 0.5},
            {"name": "SENSEX", "value": 73850.30, "change": 345.2, "change_pct": 0.47},
            {"name": "NIFTY BANK", "value": 48120.45, "change": 450.1, "change_pct": 0.94},
        ],
        "market_breadth": "Bullish",
        "advance_decline": {"advances": 32, "declines": 15, "unchanged": 3},
        "vix": 14.2,
        "fii_dii": {
            "fii_buy": 12450.5,
            "fii_sell": 11200.2,
            "fii_net": 1250.3,
            "dii_buy": 8900.8,
            "dii_sell": 8200.4,
            "dii_net": 700.4
        }
    }

@router.get("/sectors")
async def get_sectors():
    """Get performance data for all sectors."""
    return {"sectors": SECTORS_DATA}

@router.get("/{symbol}")
async def get_stock_detail(symbol: str):
    """Get detailed information for a specific stock."""
    stock = next((s for s in STOCKS_DB if s["symbol"] == symbol.upper()), None)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Enrichment
    stock.update({
        "mkt_cap_cr": round(random.uniform(50000, 2000000), 2),
        "pe_ratio": round(random.uniform(15, 60), 2),
        "pb_ratio": round(random.uniform(2, 12), 2),
        "div_yield": round(random.uniform(0.1, 2.5), 2),
        "week_52_high": round(stock["price"] * 1.2, 2),
        "week_52_low": round(stock["price"] * 0.8, 2),
    })
    return stock

@router.get("/{symbol}/ohlcv")
async def get_stock_ohlcv(symbol: str, period: str = "1D"):
    """Get historical OHLCV data for charting."""
    # Generate mock 100 data points
    import datetime
    base = datetime.datetime.now()
    data = []
    curr_price = 2500.0
    for i in range(100):
        curr_price += random.uniform(-20, 20)
        data.append({
            "time": (base - datetime.timedelta(days=100-i)).strftime("%Y-%m-%d"),
            "open": curr_price + random.uniform(-5, 5),
            "high": curr_price + random.uniform(5, 15),
            "low": curr_price - random.uniform(5, 15),
            "close": curr_price,
            "volume": random.randint(100000, 1000000)
        })
    return {"symbol": symbol.upper(), "period": period, "data": data}
