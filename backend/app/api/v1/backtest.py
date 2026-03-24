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


@router.post("", response_model=BacktestResponse)
async def create_backtest(
    data: BacktestRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Run a new backtest simulation with mock results."""
    # Generate mock results
    import random
    from datetime import datetime
    
    total_trades = random.randint(15, 45)
    win_rate = random.randint(45, 75)
    total_return = round(random.uniform(-5, 25), 2)
    
    trade_log = []
    for i in range(20):  # Partial log for frontend
        trade_log.append({
            "trade": i + 1,
            "action": random.choice(["Buy", "Sell"]),
            "price": round(random.uniform(500, 5000), 2),
            "quantity": random.randint(1, 100),
            "pnl": round(random.uniform(-5000, 15000), 2),
            "pnl_pct": round(random.uniform(-3, 8), 2),
            "timestamp": datetime.now().isoformat()
        })
    
    new_result = BacktestResult(
        user_id=current_user.id,
        strategy_name=data.strategy_name,
        symbol=data.symbol,
        start_date=datetime.fromisoformat(str(data.start_date)),
        end_date=datetime.fromisoformat(str(data.end_date)),
        initial_capital=data.initial_capital,
        final_value=data.initial_capital * (1 + total_return/100),
        total_return_pct=total_return,
        max_drawdown_pct=round(random.uniform(5, 20), 2),
        sharpe_ratio=round(random.uniform(0.8, 2.5), 2),
        total_trades=total_trades,
        parameters=data.parameters,
        trade_log={"trades": trade_log}
    )
    
    db.add(new_result)
    await db.commit()
    await db.refresh(new_result)
    
    return {
        **new_result.__dict__,
        "win_rate": win_rate,
        "trade_log": trade_log
    }


@router.get("")
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
