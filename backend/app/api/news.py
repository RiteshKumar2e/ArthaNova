from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.models import Article, StoryArc, StoryEvent
from app.schemas.schemas import ArticleResponse, StoryArcResponse
from typing import List
import datetime

router = APIRouter(prefix="/news", tags=["News"])

@router.get("/feed", response_model=List[ArticleResponse])
async def get_feed(persona: str = "investor", db: AsyncSession = Depends(get_db)):
    # Personalized Filtering based on persona_tags
    # Note: Using ilike for a simple "contains" check on the persona string
    query = select(Article)
    if persona:
        query = query.where(Article.persona_tags.ilike(f"%{persona}%"))
    
    result = await db.execute(query.order_by(Article.published_at.desc()))
    articles = result.scalars().all()
    return articles

@router.get("/arcs", response_model=List[StoryArcResponse])
async def get_story_arcs(db: AsyncSession = Depends(get_db)):
    # Fetch arcs with their events
    result = await db.execute(select(StoryArc))
    return result.scalars().all()

@router.get("/arcs/{arc_id}", response_model=StoryArcResponse)
async def get_story_arc(arc_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StoryArc).where(StoryArc.id == arc_id))
    arc = result.scalars().first()
    if not arc:
        raise HTTPException(status_code=404, detail="Story Arc not found")
    return arc

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
