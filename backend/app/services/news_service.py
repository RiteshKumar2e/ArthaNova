"""
ArthaNova — News Service
Fetches news from multiple providers: NewsAPI, Economic Times, Reuters, etc.
Includes sentiment analysis for market impact assessment.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import aiohttp
from app.core.config import settings

logger = logging.getLogger(__name__)


class NewsService:
    """
    Unified news aggregation service with multiple provider support.
    Provides market news, sector news, company-specific news with sentiment analysis.
    """
    
    def __init__(self):
        self.news_api_key = settings.NEWS_API_KEY
        self.rapidapi_key = settings.RAPIDAPI_KEY
        self.logger = logger.getChild("NewsService")
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
    
    # ─── Market News ────────────────────────────────────────────────────────────
    
    async def get_market_news(
        self,
        sector: Optional[str] = None,
        limit: int = 20,
        page: int = 1
    ) -> Dict[str, Any]:
        """
        Get latest market and financial news.
        Filters by sector if provided (IT, Banking, Energy, Auto, Pharma, FMCG, etc.)
        """
        try:
            if not self.news_api_key:
                self.logger.warning("NEWS_API_KEY not configured")
                return {"items": [], "error": "News API not configured"}
            
            # Build search query
            if sector:
                query = f"'{sector}' (India OR NSE OR BSE) stock market financial"
            else:
                query = "India stock market NSE BSE financial news"
            
            url = "https://newsapi.org/v2/everything"
            params = {
                "q": query,
                "sortBy": "publishedAt",
                "language": "en",
                "apiKey": self.news_api_key,
                "pageSize": limit,
                "page": page,
            }
            
            session = await self.get_session()
            async with session.get(
                url,
                params=params,
                timeout=aiohttp.ClientTimeout(total=15)
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    articles = data.get("articles", [])
                    
                    # Process articles
                    news_items = []
                    for article in articles:
                        sentiment = self._analyze_sentiment(article.get("description", ""))
                        news_items.append({
                            "id": hash(article.get("url", "")),
                            "title": article.get("title", ""),
                            "description": article.get("description", ""),
                            "source": article.get("source", {}).get("name", "Unknown"),
                            "url": article.get("url", ""),
                            "image_url": article.get("urlToImage", ""),
                            "published_at": article.get("publishedAt", ""),
                            "sentiment": sentiment["label"],
                            "sentiment_score": sentiment["score"],
                            "tags": self._extract_tags(article.get("title", "")),
                        })
                    
                    return {
                        "items": news_items,
                        "total": data.get("totalResults", 0),
                        "page": page,
                        "page_size": limit,
                        "provider": "newsapi",
                    }
                
                elif resp.status == 401:
                    self.logger.error("Invalid NEWS_API_KEY")
                    return {"items": [], "error": "Invalid API key"}
                else:
                    return {"items": [], "error": f"API error: {resp.status}"}
        
        except asyncio.TimeoutError:
            self.logger.error("News API request timeout")
            return {"items": [], "error": "Request timeout"}
        except Exception as e:
            self.logger.error(f"Failed to fetch market news: {e}")
            return {"items": [], "error": str(e)}
    
    # ─── Company-Specific News ──────────────────────────────────────────────────
    
    async def get_company_news(
        self,
        symbol: str,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Get news for a specific company/stock.
        """
        try:
            if not self.news_api_key:
                return {"items": [], "error": "News API not configured"}
            
            # Remove ".NS" suffix for cleaner search
            company_search = symbol.replace(".NS", "").replace(".BO", "")
            
            url = "https://newsapi.org/v2/everything"
            params = {
                "q": f"'{company_search}' stock India",
                "sortBy": "publishedAt",
                "language": "en",
                "apiKey": self.news_api_key,
                "pageSize": limit,
            }
            
            session = await self.get_session()
            async with session.get(
                url,
                params=params,
                timeout=aiohttp.ClientTimeout(total=15)
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    articles = data.get("articles", [])
                    
                    news_items = []
                    for article in articles:
                        sentiment = self._analyze_sentiment(article.get("description", ""))
                        news_items.append({
                            "id": hash(article.get("url", "")),
                            "title": article.get("title", ""),
                            "description": article.get("description", ""),
                            "source": article.get("source", {}).get("name", ""),
                            "url": article.get("url", ""),
                            "published_at": article.get("publishedAt", ""),
                            "sentiment": sentiment["label"],
                            "sentiment_score": sentiment["score"],
                        })
                    
                    return {
                        "symbol": symbol,
                        "items": news_items,
                        "total": len(news_items),
                        "provider": "newsapi",
                    }
                
                return {"symbol": symbol, "items": [], "error": "Failed to fetch news"}
        
        except Exception as e:
            self.logger.error(f"Failed to fetch company news for {symbol}: {e}")
            return {"symbol": symbol, "items": [], "error": str(e)}
    
    # ─── Market Sentiment ────────────────────────────────────────────────────────
    
    async def get_market_sentiment(self) -> Dict[str, Any]:
        """
        Aggregate market sentiment from recent news.
        """
        try:
            news_data = await self.get_market_news(limit=50)
            articles = news_data.get("items", [])
            
            if not articles:
                return {
                    "overall_sentiment": "Neutral",
                    "sentiment_score": 0.0,
                    "positive_count": 0,
                    "negative_count": 0,
                    "neutral_count": 0,
                }
            
            sentiments = [item.get("sentiment_score", 0) for item in articles]
            sentiment_labels = [item.get("sentiment", "Neutral") for item in articles]
            
            overall_score = sum(sentiments) / len(sentiments) if sentiments else 0
            
            overall_label = "Positive" if overall_score > 0.1 else (
                "Negative" if overall_score < -0.1 else "Neutral"
            )
            
            return {
                "overall_sentiment": overall_label,
                "sentiment_score": round(overall_score, 3),
                "positive_count": len([s for s in sentiment_labels if s == "Positive"]),
                "negative_count": len([s for s in sentiment_labels if s == "Negative"]),
                "neutral_count": len([s for s in sentiment_labels if s == "Neutral"]),
                "total_articles": len(articles),
                "timestamp": datetime.now().isoformat(),
            }
        
        except Exception as e:
            self.logger.error(f"Failed to get market sentiment: {e}")
            return {"error": str(e)}
    
    # ─── Trending Topics ────────────────────────────────────────────────────────
    
    async def get_trending_topics(self, limit: int = 10) -> Dict[str, Any]:
        """
        Extract trending topics from recent market news.
        """
        try:
            news_data = await self.get_market_news(limit=100)
            articles = news_data.get("items", [])
            
            # Extract keywords from titles
            keywords = {}
            important_words = {
                "RBI", "Fed", "Q3", "Q4", "IPO", "FII", "DII",
                "Merger", "Acquisition", "Listing", "Results",
                "Budget", "Election", "Inflation", "Rate", "Nifty", "Sensex"
            }
            
            for article in articles:
                title = article.get("title", "").upper()
                description = article.get("description", "").upper()
                full_text = f"{title} {description}"
                
                for word in important_words:
                    if word in full_text:
                        keywords[word] = keywords.get(word, 0) + 1
            
            # Sort by frequency
            trending = sorted(
                keywords.items(),
                key=lambda x: x[1],
                reverse=True
            )[:limit]
            
            return {
                "trending_topics": [
                    {"topic": topic, "mentions": count}
                    for topic, count in trending
                ],
                "total_articles_analyzed": len(articles),
                "timestamp": datetime.now().isoformat(),
            }
        
        except Exception as e:
            self.logger.error(f"Failed to get trending topics: {e}")
            return {"error": str(e)}
    
    # ─── IPO & Corporate News ───────────────────────────────────────────────────
    
    async def get_ipo_news(self, limit: int = 10) -> Dict[str, Any]:
        """Get IPO and listing related news."""
        try:
            url = "https://newsapi.org/v2/everything"
            params = {
                "q": "IPO listing NSE BSE India stock market",
                "sortBy": "publishedAt",
                "language": "en",
                "apiKey": self.news_api_key,
                "pageSize": limit,
            }
            
            session = await self.get_session()
            async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    articles = data.get("articles", [])
                    
                    news_items = []
                    for article in articles:
                        news_items.append({
                            "title": article.get("title", ""),
                            "source": article.get("source", {}).get("name", ""),
                            "url": article.get("url", ""),
                            "published_at": article.get("publishedAt", ""),
                            "description": article.get("description", ""),
                        })
                    
                    return {
                        "items": news_items,
                        "total": len(news_items),
                        "provider": "newsapi",
                    }
                
                return {"items": [], "error": "Failed to fetch IPO news"}
        
        except Exception as e:
            self.logger.error(f"Failed to fetch IPO news: {e}")
            return {"items": [], "error": str(e)}
    
    # ─── Sentiment Analysis ─────────────────────────────────────────────────────
    
    @staticmethod
    def _analyze_sentiment(text: str) -> Dict[str, Any]:
        """
        Simple sentiment analysis using keyword matching.
        For production, consider using ML models or services like AWS Comprehend.
        """
        positive_words = {
            "surge", "soar", "rally", "gain", "profit", "beat", "bullish",
            "strong", "growth", "record", "high", "best", "outperform",
            "upgrade", "positive", "success", "increase", "jumps"
        }
        
        negative_words = {
            "fall", "drop", "plunge", "loss", "decline", "bearish",
            "weak", "miss", "sell", "downgrade", "negative", "cuts",
            "crisis", "risk", "concern", "warning", "slump", "downside"
        }
        
        text_lower = text.lower() if text else ""
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            score = min(positive_count * 0.15, 1.0)
            label = "Positive"
        elif negative_count > positive_count:
            score = -min(negative_count * 0.15, 1.0)
            label = "Negative"
        else:
            score = 0.0
            label = "Neutral"
        
        return {"label": label, "score": score}
    
    @staticmethod
    def _extract_tags(title: str) -> List[str]:
        """Extract relevant tags/keywords from title."""
        keywords = {}
        title_words = title.split()
        
        # Look for capitalized words (likely proper nouns: stock symbols, company names)
        tags = [word.strip(".,!;:") for word in title_words if word[0].isupper()]
        
        return tags[:3]  # Return top 3 tags


# ─── Singleton instance ────────────────────────────────────────────────────────
_news_service = None


def get_news_service() -> NewsService:
    """Get or create singleton instance of NewsService."""
    global _news_service
    if _news_service is None:
        _news_service = NewsService()
    return _news_service
