from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.models import Article
from app.schemas.schemas import ArticleResponse
from typing import List
import datetime

router = APIRouter(prefix="/news", tags=["News"])

@router.get("/feed", response_model=List[ArticleResponse])
async def get_feed(persona: str = "investor", db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).order_by(Article.published_at.desc()))
    articles = result.scalars().all()
    
    # If no articles, return mock ones just to keep the UI alive for now 
    # (should ideally be empty list, but for demo let's keep some data)
    if not articles:
        return [
            {
                "id": 1,
                "title": "NVIDIA Blackwell: A New Era of Compute",
                "summary": "Technical deep dive into the next generation architecture.",
                "category": "Technology",
                "source": "ArthaNova Intel",
                "sentiment_score": 0.82,
                "impact_score": "High",
                "published_at": datetime.datetime.now()
            },
            {
                "id": 2,
                "title": "Sovereign AI Infrastructure Booms in APAC",
                "summary": "How nations are building their own intelligence clouds.",
                "category": "Politics",
                "source": "Global Affairs",
                "sentiment_score": 0.65,
                "impact_score": "Medium",
                "published_at": datetime.datetime.now()
            }
        ]
    return articles

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
