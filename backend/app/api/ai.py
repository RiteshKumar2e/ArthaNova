from fastapi import APIRouter, Depends
from app.services.ai_service import ai_service
from typing import List, Optional

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

@router.post("/synthesize", response_model=dict)
async def synthesize():
    articles = ["Market Trends", "Tech Innovations"]
    return await ai_service.synthesize_news(articles)

@router.post("/translate")
async def translate(text: str, target_lang: str):
    # Simulated translation logic
    return {
        "original_text": text,
        "translated_text": f"[Translated to {target_lang}]: {text}",
        "context_note": "Technical financial context preserved."
    }

@router.post("/video-script")
async def generate_script(article_id: int):
    return {"script": await ai_service.generate_video_script(f"Article {article_id} content...")}
