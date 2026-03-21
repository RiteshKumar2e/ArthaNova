"""ArthaNova — Stocks API router with market data."""

from typing import Optional
from fastapi import APIRouter, Query

router = APIRouter(prefix="/stocks", tags=["Stocks & Market Data"])

# TODO: Integrate with real NSE/BSE API
# All placeholder mock data endpoints have been removed.
# Replace with actual market data integration.
