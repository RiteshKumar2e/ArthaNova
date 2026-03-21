"""ArthaNova — Backtesting API router."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, BacktestResult
from app.schemas.schemas import BacktestRequest, BacktestResponse, MessageResponse

router = APIRouter(prefix="/backtest", tags=["Backtesting Engine"])

# TODO: Implement real backtesting engine with actual market data
# All mock backtest functionality has been removed.


@router.post("/", response_model=BacktestResponse)
async def create_backtest(
    data: BacktestRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Run a new backtest simulation."""
    raise HTTPException(
        status_code=503,
        detail="Backtesting engine is not yet integrated. Please implement real market data integration."
    )


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
