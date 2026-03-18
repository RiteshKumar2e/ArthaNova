from fastapi import APIRouter, Depends
from app.services.ai_service import ai_service
from typing import List, Optional

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

@router.post("/synthesize", response_model=dict)
async def synthesize(article_ids: List[int]):
    return await ai_service.synthesize_news([f"Article {aid}" for aid in article_ids])

@router.post("/vernacular", response_model=dict)
async def vernacular_engine(text: str, target_lang: str):
    return await ai_service.translate_with_context(text, target_lang)

@router.post("/video-studio", response_model=dict)
async def video_studio(article_title: str):
    return await ai_service.generate_video_studio_content(article_title)

@router.get("/story-prediction", response_model=dict)
async def story_prediction(title: str):
    prediction = await ai_service.predict_story_arc(title)
    return {"prediction": prediction}
