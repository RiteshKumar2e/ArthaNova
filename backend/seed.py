import asyncio
import datetime
from app.db.database import AsyncSessionLocal as SessionLocal, engine
from app.models.models import Article, Base

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        articles = [
            Article(
                title="NVIDIA Blackwell: The Convergence of Compute & Sovereignty",
                summary="The unveiling of the Blackwell GPU architecture marks a pivotal moment in the computational landscape, yet its secondary effects on global power distribution remain under-analyzed.",
                content="Full analysis content here...",
                category="Technology",
                source="ArthaNova Intel",
                sentiment_score=0.82,
                impact_score="Critical",
                published_at=datetime.datetime.now(),
                metadata_json={"tags": ["AI", "Compute", "Sovereignty"]}
            ),
            Article(
                title="Sovereign AI Infrastructure Booms in APAC",
                summary="How nations across Asia-Pacific are building their own sovereign intelligence clouds to ensure data security and technological independence.",
                content="Full report on APAC AI infrastructure...",
                category="Politics",
                source="Global Affairs",
                sentiment_score=0.65,
                impact_score="High",
                published_at=datetime.datetime.now() - datetime.timedelta(hours=4),
                metadata_json={"region": "APAC"}
            ),
            Article(
                title="Digital Rupee Expansion: The Future of Fintech in India",
                summary="The RBI's latest push for Digital Rupee adoption across retail markets signals a major shift in the Indian financial landscape.",
                content="Detailed look at CBDC adoption in India...",
                category="Finance",
                source="Economic Times",
                sentiment_score=0.74,
                impact_score="Medium",
                published_at=datetime.datetime.now() - datetime.timedelta(days=1)
            )
        ]
        db.add_all(articles)
        await db.commit()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy.ext.asyncio import AsyncSession
    
    # Re-defining SessionLocal for the script context if needed or just use database.py
    # But database.py has AsyncSessionLocal
    
    asyncio.run(seed_data())
