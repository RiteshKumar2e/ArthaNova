import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import aiohttp
import yfinance as yf
import pandas as pd

from app.core.config import settings

logger = logging.getLogger(__name__)


class MarketDataService:
    """
    Unified market data service with multiple provider support and fallback logic.
    Provides stock data, financial metrics, technical indicators, and news.
    """
    
    def __init__(self):
        self.alpha_vantage_key = settings.ALPHA_VANTAGE_API_KEY
        self.polygon_key = settings.POLYGON_API_KEY
        self.marketstack_key = settings.MARKETSTACK_API_KEY
        self.finnhub_key = settings.FINNHUB_API_KEY
        self.rapidapi_key = settings.RAPIDAPI_KEY
        self.news_api_key = settings.NEWS_API_KEY
        
        self.logger = logger.getChild("MarketDataService")
        self._session: Optional[aiohttp.ClientSession] = None
    
    async def get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session."""
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session
    
    async def close(self):
        """Close HTTP session."""
        if self._session and not self._session.closed:
            await self._session.close()
    
    # ─── Stock Price Data ───────────────────────────────────────────────────────
    
    async def get_stock_price(self, symbol: str) -> Dict[str, Any]:
        """
        Get current stock price with multiple provider fallbacks.
        Primary: Finnhub → Fallback: Alpha Vantage → Fallback: YFinance
        """
        try:
            # Try Finnhub first (most reliable)
            if self.finnhub_key:
                price_data = await self._finnhub_quote(symbol)
                if price_data:
                    return {
                        "symbol": symbol,
                        "price": price_data.get("c"),
                        "change": price_data.get("d"),
                        "change_percent": price_data.get("dp"),
                        "high": price_data.get("h"),
                        "low": price_data.get("l"),
                        "open": price_data.get("o"),
                        "prev_close": price_data.get("pc"),
                        "timestamp": datetime.now().isoformat(),
                        "provider": "finnhub",
                    }
        except Exception as e:
            self.logger.warning(f"Finnhub lookup failed for {symbol}: {e}")
        
        try:
            # Fallback to Alpha Vantage
            if self.alpha_vantage_key:
                price_data = await self._alpha_vantage_quote(symbol)
                if price_data:
                    return price_data
        except Exception as e:
            self.logger.warning(f"Alpha Vantage lookup failed for {symbol}: {e}")
        
        try:
            # Final fallback to YFinance
            price_data = await self._yfinance_quote(symbol)
            if price_data:
                return price_data
        except Exception as e:
            self.logger.warning(f"YFinance lookup failed for {symbol}: {e}")
        
        self.logger.error(f"Could not fetch price for {symbol} from any provider")
        return {"symbol": symbol, "price": None, "error": True}
    
    async def _finnhub_quote(self, symbol: str) -> Optional[Dict]:
        """Fetch quote from Finnhub."""
        url = f"https://finnhub.io/api/v1/quote"
        params = {
            "symbol": symbol,
            "token": self.finnhub_key,
        }
        try:
            session = await self.get_session()
            async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status == 200:
                    return await resp.json()
        except asyncio.TimeoutError:
            self.logger.warning(f"Finnhub timeout for {symbol}")
        except Exception as e:
            self.logger.debug(f"Finnhub error: {e}")
        return None
    
    async def _alpha_vantage_quote(self, symbol: str) -> Optional[Dict]:
        """Fetch quote from Alpha Vantage."""
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": self.alpha_vantage_key,
        }
        try:
            session = await self.get_session()
            async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    quote = data.get("Global Quote", {})
                    if quote:
                        return {
                            "symbol": symbol,
                            "price": float(quote.get("05. price", 0)),
                            "change": float(quote.get("09. change", 0)),
                            "change_percent": float(quote.get("10. change percent", "0").rstrip("%")),
                            "high": float(quote.get("03. high", 0)),
                            "low": float(quote.get("04. low", 0)),
                            "open": float(quote.get("02. open", 0)),
                            "prev_close": float(quote.get("08. previous close", 0)),
                            "timestamp": datetime.now().isoformat(),
                            "provider": "alpha_vantage",
                        }
        except asyncio.TimeoutError:
            self.logger.warning(f"Alpha Vantage timeout for {symbol}")
        except Exception as e:
            self.logger.debug(f"Alpha Vantage error: {e}")
        return None
    
    async def _yfinance_quote(self, symbol: str) -> Optional[Dict]:
        """Fetch quote from YFinance (sync, run in thread pool)."""
        try:
            loop = asyncio.get_event_loop()
            ticker = await loop.run_in_executor(None, yf.Ticker, symbol)
            info = await loop.run_in_executor(None, lambda: ticker.info)
            
            if "currentPrice" in info or "regularMarketPrice" in info:
                price = info.get("currentPrice") or info.get("regularMarketPrice", 0)
                return {
                    "symbol": symbol,
                    "price": price,
                    "change": info.get("regularMarketChange", 0),
                    "change_percent": info.get("regularMarketChangePercent", 0),
                    "high": info.get("regularMarketDayHigh", 0),
                    "low": info.get("regularMarketDayLow", 0),
                    "open": info.get("regularMarketOpen", 0),
                    "prev_close": info.get("regularMarketPreviousClose", 0),
                    "timestamp": datetime.now().isoformat(),
                    "provider": "yfinance",
                }
        except Exception as e:
            self.logger.debug(f"YFinance error: {e}")
        return None
    
    # ─── Historical Price Data ──────────────────────────────────────────────────
    
    async def get_historical_data(
        self, 
        symbol: str, 
        days: int = 30,
        interval: str = "1d"  # 1d, 1wk, 1mo
    ) -> Dict[str, Any]:
        """
        Get historical price data for technical analysis.
        Returns OHLCV data and technical indicators.
        """
        try:
            loop = asyncio.get_event_loop()
            
            # Fetch data using YFinance
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days + 10)  # Extra buffer for indicators
            
            ticker = yf.Ticker(symbol)
            hist = await loop.run_in_executor(
                None,
                lambda s=start_date, e=end_date, i=interval: ticker.history(start=s, end=e, interval=i)
            )
            
            if hist.empty:
                return {"symbol": symbol, "error": "No data available"}
            
            # Calculate technical indicators
            hist["SMA_20"] = hist["Close"].rolling(window=20).mean()
            hist["SMA_50"] = hist["Close"].rolling(window=50).mean()
            hist["RSI"] = self._calculate_rsi(hist["Close"])
            hist["MACD"] = self._calculate_macd(hist["Close"])
            
            # Prepare response
            data_list = []
            for idx, row in hist.iterrows():
                data_list.append({
                    "date": idx.strftime("%Y-%m-%d") if hasattr(idx, 'strftime') else str(idx),
                    "open": float(row["Open"]),
                    "high": float(row["High"]),
                    "low": float(row["Low"]),
                    "close": float(row["Close"]),
                    "volume": int(row["Volume"]),
                    "sma_20": float(row["SMA_20"]) if pd.notna(row["SMA_20"]) else None,
                    "sma_50": float(row["SMA_50"]) if pd.notna(row["SMA_50"]) else None,
                    "rsi": float(row["RSI"]) if pd.notna(row["RSI"]) else None,
                })
            
            return {
                "symbol": symbol,
                "data": data_list[-min(days, len(data_list)):],  # Return only requested days
                "provider": "yfinance",
            }
        
        except Exception as e:
            self.logger.error(f"Failed to get historical data for {symbol}: {e}")
            return {"symbol": symbol, "error": str(e)}
    
    # ─── Forex Data ─────────────────────────────────────────────────────────────
    
    async def get_forex_rate(self, from_currency: str, to_currency: str) -> Optional[Dict]:
        """
        Get forex conversion rate using Alpha Vantage.
        """
        try:
            if not self.alpha_vantage_key:
                return None
            
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "CURRENCY_EXCHANGE_RATE",
                "from_currency": from_currency,
                "to_currency": to_currency,
                "apikey": self.alpha_vantage_key,
            }
            
            session = await self.get_session()
            async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    rate_data = data.get("Realtime Currency Exchange Rate", {})
                    if rate_data:
                        return {
                            "from": from_currency,
                            "to": to_currency,
                            "rate": float(rate_data.get("5. Exchange Rate", 0)),
                            "bid_ask_spread": rate_data.get("8. Bid/Ask Spread", "N/A"),
                            "timestamp": datetime.now().isoformat(),
                        }
        except Exception as e:
            self.logger.warning(f"Forex rate fetch failed: {e}")
        
        return None
    
    # ─── Company Financials ─────────────────────────────────────────────────────
    
    async def get_company_info(self, symbol: str) -> Dict[str, Any]:
        """
        Get company fundamentals, P/E ratio, market cap, etc.
        Provider: YFinance + Finnhub
        """
        try:
            loop = asyncio.get_event_loop()
            ticker = yf.Ticker(symbol)
            info = await loop.run_in_executor(None, lambda: ticker.info)
            
            return {
                "symbol": symbol,
                "company_name": info.get("longName", ""),
                "sector": info.get("sector", ""),
                "industry": info.get("industry", ""),
                "market_cap": info.get("marketCap", 0),
                "pe_ratio": info.get("trailingPE", None),
                "forward_pe": info.get("forwardPE", None),
                "dividend_yield": info.get("dividendYield", 0),
                "fifty_two_week_high": info.get("fiftyTwoWeekHigh", 0),
                "fifty_two_week_low": info.get("fiftyTwoWeekLow", 0),
                "description": info.get("longBusinessSummary", ""),
                "website": info.get("website", ""),
                "employees": info.get("fullTimeEmployees", 0),
            }
        
        except Exception as e:
            self.logger.error(f"Failed to get company info for {symbol}: {e}")
            return {"symbol": symbol, "error": str(e)}
    
    # ─── Technical Indicator Calculations ────────────────────────────────────────
    
    @staticmethod
    def _calculate_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
        """Calculate Relative Strength Index."""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    @staticmethod
    def _calculate_macd(prices: pd.Series) -> pd.Series:
        """Calculate MACD (simplified)."""
        ema_12 = prices.ewm(span=12).mean()
        ema_26 = prices.ewm(span=26).mean()
        return ema_12 - ema_26
    
    # ─── Market Overview ────────────────────────────────────────────────────────
    
    async def get_market_overview(self) -> Dict[str, Any]:
        """Get India market overview: Nifty, Sensex, market breadth, etc."""
        try:
            indices = []
            index_symbols = ["^NSEI", "^BSESN"]  # Nifty 50, Sensex
            
            loop = asyncio.get_event_loop()
            
            for idx_symbol in index_symbols:
                ticker = yf.Ticker(idx_symbol)
                info = await loop.run_in_executor(None, lambda t=ticker: t.info)
                hist = await loop.run_in_executor(
                    None,
                    lambda t=ticker: t.history(period="5d")
                )
                
                if not hist.empty:
                    indices.append({
                        "name": "Nifty 50" if idx_symbol == "^NSEI" else "Sensex",
                        "symbol": idx_symbol,
                        "price": float(info.get("currentPrice", 0)),
                        "change": float(info.get("regularMarketChange", 0)),
                        "change_percent": float(info.get("regularMarketChangePercent", 0)),
                        "volume": int(info.get("volume", 0)),
                    })
            
            return {
                "indices": indices,
                "timestamp": datetime.now().isoformat(),
                "market_status": "Open" if datetime.now().hour < 16 else "Closed",
            }
        
        except Exception as e:
            self.logger.error(f"Failed to get market overview: {e}")
            return {"error": str(e)}
    
    # ─── Sector Performance ─────────────────────────────────────────────────────
    
    async def get_sector_performance(self) -> Dict[str, Any]:
        """
        Get sector-wise performance using market trackers.
        """
        sector_map = {
            "IT": ["TCS.NS", "INFY.NS", "WIPRO.NS", "HCLTECH.NS"],
            "Banking": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "AXISBANK.NS"],
            "Energy": ["RELIANCE.NS", "NTPC.NS", "POWERGRID.NS", "COALINDIA.NS"],
            "Pharma": ["SUNPHARMA.NS", "DIVISLAB.NS", "CIPLA.NS", "LUPICARE.NS"],
            "Auto": ["MARUTI.NS", "TATAMOTORS.NS", "HYUNDAI.NS", "BAJAJFINSV.NS"],
            "FMCG": ["ITC.NS", "NESTLEIND.NS", "HINDUNILVR.NS", "BRITANNIA.NS"],
        }
        
        sectors = []
        try:
            loop = asyncio.get_event_loop()
            
            for sector, stocks in sector_map.items():
                prices = []
                for stock in stocks:
                    try:
                        ticker = yf.Ticker(stock)
                        info = await loop.run_in_executor(None, lambda t=ticker: t.info)
                        if "currentPrice" in info or "regularMarketPrice" in info:
                            prices.append(
                                info.get("currentPrice") or info.get("regularMarketPrice", 0)
                            )
                    except:
                        pass
                
                if prices:
                    sectors.append({
                        "name": sector,
                        "avg_price": sum(prices) / len(prices),
                        "stock_count": len(prices),
                    })
            
            return {"sectors": sectors, "timestamp": datetime.now().isoformat()}
        
        except Exception as e:
            self.logger.error(f"Failed to get sector performance: {e}")
            return {"error": str(e)}


# ─── Singleton instance ────────────────────────────────────────────────────────
_market_data_service = None


def get_market_data_service() -> MarketDataService:
    """Get or create singleton instance of MarketDataService."""
    global _market_data_service
    if _market_data_service is None:
        _market_data_service = MarketDataService()
    return _market_data_service
