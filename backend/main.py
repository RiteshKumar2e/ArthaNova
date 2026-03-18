"""
ArthaNova Backend — Main FastAPI Application Entry Point
AI for the Indian Investor
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.logging import setup_logging
from app.db.database import create_tables
from app.api.v1.router import api_router
from app.middleware.request_logger import RequestLoggerMiddleware

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    logger.info("🚀 ArthaNova API starting up...")
    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    # Initialize database tables
    await create_tables()
    logger.info("✅ Database tables verified")
    logger.info(f"🌍 Running in {settings.ENVIRONMENT} mode")
    yield
    logger.info("🛑 ArthaNova API shutting down...")


def create_application() -> FastAPI:
    """Factory function to create the FastAPI application."""
    app = FastAPI(
        title=f"{settings.APP_NAME} API",
        description="""
## ArthaNova — AI for the Indian Investor

Production-grade AI-first fintech platform providing:
- 🤖 AI-powered market intelligence
- 📊 Portfolio analytics & risk scoring
- 🔍 Stock screening & technical analysis
- 📰 News sentiment & filing analysis
- 🚨 Real-time opportunity alerts
- 💬 Conversational AI with RAG
        """,
        version=settings.APP_VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(RequestLoggerMiddleware)

    # Mount static files
    if os.path.exists(settings.UPLOAD_DIR):
        app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

    # Include API router
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/", tags=["Health"])
    async def root():
        return {
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "operational",
            "environment": settings.ENVIRONMENT,
            "docs": "/api/docs",
        }

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "healthy", "service": settings.APP_NAME}

    return app


app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
    )
