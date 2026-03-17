from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, news, ai
from app.core.config import settings
from app.db.database import engine
from app.models.models import Base

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(news.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to ArthaNova AI Intelligence API", "v1_docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
