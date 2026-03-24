"""ArthaNova — Main API v1 router aggregating all sub-routers."""

from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.stocks import router as stocks_router
from app.api.v1.portfolio import router as portfolio_router
from app.api.v1.ai_engine import router as ai_router
from app.api.v1.market_data import (
    news_router,
    ipo_router,
    insider_router,
    deals_router,
    stock_router,
    forex_router,
    company_news_router,
)
from app.api.v1.user import router as user_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.backtest import router as backtest_router
from app.api.v1.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(admin_router)
api_router.include_router(stocks_router)
api_router.include_router(portfolio_router)
api_router.include_router(ai_router)
api_router.include_router(news_router)
api_router.include_router(ipo_router)
api_router.include_router(insider_router)
api_router.include_router(deals_router)
api_router.include_router(stock_router)
api_router.include_router(forex_router)
api_router.include_router(company_news_router)
api_router.include_router(alerts_router)
api_router.include_router(backtest_router)
