"""ArthaNova — Backtesting API router."""

import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, BacktestResult
from app.schemas.schemas import BacktestRequest, BacktestResponse, MessageResponse

router = APIRouter(prefix="/backtest", tags=["Backtesting Engine"])


def run_mock_backtest(data: BacktestRequest) -> dict:
    """Simulate a backtest (replace with real engine)."""
    total_return = random.uniform(-20, 80)
    final_value = data.initial_capital * (1 + total_return / 100)
    trades = random.randint(15, 60)

    trade_log = []
    capital = data.initial_capital
    for i in range(trades):
        pnl_pct = random.uniform(-5, 8)
        pnl = capital * pnl_pct / 100
        capital += pnl
        trade_log.append({
            "trade": i + 1,
            "action": "Buy" if i % 2 == 0 else "Sell",
            "price": round(random.uniform(500, 3000), 2),
            "quantity": random.randint(10, 200),
            "pnl": round(pnl, 2),
            "pnl_pct": round(pnl_pct, 2),
        })

    return {
        "final_value": round(final_value, 2),
        "total_return_pct": round(total_return, 2),
        "max_drawdown_pct": round(random.uniform(-25, -5), 2),
        "sharpe_ratio": round(random.uniform(0.5, 2.8), 2),
        "total_trades": trades,
        "win_rate": round(random.uniform(45, 70), 1),
        "trade_log": trade_log[:20],  # Limit for response
    }


@router.post("/", response_model=BacktestResponse)
async def create_backtest(
    data: BacktestRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Run a new backtest simulation."""
    results = run_mock_backtest(data)

    backtest = BacktestResult(
        user_id=current_user.id,
        strategy_name=data.strategy_name,
        symbol=data.symbol.upper(),
        start_date=datetime.strptime(data.start_date, "%Y-%m-%d"),
        end_date=datetime.strptime(data.end_date, "%Y-%m-%d"),
        initial_capital=data.initial_capital,
        final_value=results["final_value"],
        total_return_pct=results["total_return_pct"],
        max_drawdown_pct=results["max_drawdown_pct"],
        sharpe_ratio=results["sharpe_ratio"],
        total_trades=results["total_trades"],
        parameters=data.parameters,
        trade_log=results["trade_log"],
    )
    db.add(backtest)
    await db.flush()
    return backtest


@router.get("/")
async def get_backtest_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BacktestResult)
        .where(BacktestResult.user_id == current_user.id)
        .order_by(BacktestResult.created_at.desc())
        .limit(20)
    )
    tests = result.scalars().all()
    return [
        {
            "id": t.id, "strategy_name": t.strategy_name, "symbol": t.symbol,
            "total_return_pct": t.total_return_pct, "sharpe_ratio": t.sharpe_ratio,
            "total_trades": t.total_trades, "created_at": t.created_at,
        }
        for t in tests
    ]
