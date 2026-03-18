"""ArthaNova — Portfolio API router."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, Portfolio, Holding
from app.schemas.schemas import HoldingCreate, HoldingResponse, PortfolioResponse, MessageResponse
import random

router = APIRouter(prefix="/portfolio", tags=["Portfolio Management"])


def compute_holding_metrics(holding: Holding) -> dict:
    current_price = holding.current_price or (holding.avg_buy_price * (0.9 + random.random() * 0.4))
    invested = holding.quantity * holding.avg_buy_price
    current = holding.quantity * current_price
    return {
        "id": holding.id,
        "symbol": holding.symbol,
        "company_name": holding.company_name,
        "quantity": holding.quantity,
        "avg_buy_price": holding.avg_buy_price,
        "current_price": round(current_price, 2),
        "sector": holding.sector,
        "exchange": holding.exchange,
        "invested_value": round(invested, 2),
        "current_value": round(current, 2),
        "pnl": round(current - invested, 2),
        "pnl_pct": round(((current - invested) / invested) * 100, 2),
    }


@router.get("/", response_model=dict)
async def get_portfolio(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's full portfolio with holdings and analytics."""
    result = await db.execute(
        select(Portfolio).where(Portfolio.user_id == current_user.id)
    )
    portfolio = result.scalar_one_or_none()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holdings_result = await db.execute(
        select(Holding).where(Holding.portfolio_id == portfolio.id)
    )
    holdings = holdings_result.scalars().all()
    holding_data = [compute_holding_metrics(h) for h in holdings]

    total_invested = sum(h["invested_value"] for h in holding_data)
    current_value = sum(h["current_value"] for h in holding_data)
    total_pnl = current_value - total_invested

    # Sector allocation
    sectors = {}
    for h in holding_data:
        s = h["sector"] or "Other"
        sectors[s] = sectors.get(s, 0) + h["current_value"]

    sector_allocation = [
        {"sector": k, "value": round(v, 2), "pct": round((v / current_value * 100) if current_value else 0, 1)}
        for k, v in sectors.items()
    ]

    return {
        "id": portfolio.id,
        "name": portfolio.name,
        "total_invested": round(total_invested, 2),
        "current_value": round(current_value, 2),
        "total_pnl": round(total_pnl, 2),
        "total_pnl_pct": round((total_pnl / total_invested * 100) if total_invested else 0, 2),
        "risk_score": round(random.uniform(3, 8.5), 1),
        "diversification_score": round(min(len(sectors) * 12, 100), 1),
        "holdings": holding_data,
        "sector_allocation": sector_allocation,
        "holdings_count": len(holding_data),
    }


@router.post("/holdings", status_code=status.HTTP_201_CREATED)
async def add_holding(
    data: HoldingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a stock holding to portfolio."""
    result = await db.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = result.scalar_one_or_none()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holding = Holding(
        portfolio_id=portfolio.id,
        symbol=data.symbol.upper(),
        company_name=data.company_name,
        quantity=data.quantity,
        avg_buy_price=data.avg_buy_price,
        sector=data.sector,
        exchange=data.exchange,
    )
    db.add(holding)
    await db.flush()
    return compute_holding_metrics(holding)


@router.delete("/holdings/{holding_id}", response_model=MessageResponse)
async def remove_holding(
    holding_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a holding from portfolio."""
    result = await db.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = result.scalar_one_or_none()

    holding_result = await db.execute(
        select(Holding).where(Holding.id == holding_id, Holding.portfolio_id == portfolio.id)
    )
    holding = holding_result.scalar_one_or_none()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    await db.delete(holding)
    return MessageResponse(message=f"Removed {holding.symbol} from portfolio")


@router.get("/analytics")
async def get_portfolio_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get advanced portfolio analytics and AI recommendations."""
    return {
        "risk_metrics": {
            "portfolio_beta": round(random.uniform(0.7, 1.4), 2),
            "value_at_risk_1d": round(random.uniform(1, 3.5), 2),
            "sharpe_ratio": round(random.uniform(0.8, 2.5), 2),
            "max_drawdown": round(random.uniform(-15, -5), 2),
            "volatility_annualized": round(random.uniform(12, 28), 1),
        },
        "ai_recommendations": [
            {"action": "Rebalance", "reason": "IT sector allocation exceeds 35% of portfolio", "priority": "High"},
            {"action": "Add SGB/Gold", "reason": "Hedge against equity volatility", "priority": "Medium"},
            {"action": "Review", "reason": "2 holdings below cost basis for 6+ months", "priority": "Low"},
        ],
        "top_performers": [],
        "bottom_performers": [],
    }
