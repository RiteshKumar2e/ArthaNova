import asyncio
import datetime
from app.db.database import AsyncSessionLocal as SessionLocal, engine
from app.models.models import Article, Base, StoryArc, StoryEvent, User

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        # 1. Articles with persona_tags
        articles = [
            Article(
                title="Sovereign AI: Why India is building its own LLM stack",
                summary="A deep dive into Bhashini and the push for native language models.",
                content="Full content on sovereign AI...",
                category="Technology",
                source="ArthaNova Intel",
                sentiment_score=0.85,
                impact_score="Critical",
                persona_tags="investor,founder,student",
                published_at=datetime.datetime.now()
            ),
            Article(
                title="The Rise of Vertical SaaS in Tier 2 Cities",
                summary="Why Nagpur and Indore are becoming the new hubs for specialized software.",
                content="Content on regional SaaS growth...",
                category="Business",
                source="Startup Pulse",
                sentiment_score=0.72,
                impact_score="High",
                persona_tags="founder",
                published_at=datetime.datetime.now() - datetime.timedelta(hours=2)
            ),
            Article(
                title="Understanding Yield Curves: A Student's Guide to 2026 Markets",
                summary="Breaking down complex financial instruments for the next generation.",
                content="Education content on finance...",
                category="Finance",
                source="EduNews",
                sentiment_score=0.55,
                impact_score="Medium",
                persona_tags="student",
                published_at=datetime.datetime.now() - datetime.timedelta(days=1)
            ),
            Article(
                title="Green Hydrogen: The $50B Opportunity in Gujarat",
                summary="A massive infrastructure play that could redefine energy security.",
                content="Deep dive into green hydrogen projects...",
                category="Energy",
                source="EcoTimes",
                sentiment_score=0.91,
                impact_score="Critical",
                persona_tags="investor",
                published_at=datetime.datetime.now() - datetime.timedelta(hours=5)
            )
        ]
        db.add_all(articles)
        
        # 2. Story Arcs
        arc1 = StoryArc(
            title="The Great Consolidation: Indian E-commerce 2026",
            description="Tracking the merger of major quick-commerce players and the regulatory fallout.",
            key_players=[{"name": "Zepto-equivalent", "role": "Aggressor"}, {"name": "CCI", "role": "Regulator"}],
            status="Ongoing",
            prediction="Expect a 15% rise in platform fees by year-end."
        )
        db.add(arc1)
        await db.flush()
        
        # 3. Story Events
        events = [
            StoryEvent(
                arc_id=arc1.id,
                title="Platform Fee Hike Initial Signaling",
                description="Leaked internal memos suggest a shift in pricing strategy.",
                sentiment=-0.4,
                event_date=datetime.datetime.now() - datetime.timedelta(days=10)
            ),
            StoryEvent(
                arc_id=arc1.id,
                title="Regulatory Inquiry Launched",
                description="CCI asks for data on market share and predatory pricing.",
                sentiment=-0.2,
                event_date=datetime.datetime.now() - datetime.timedelta(days=2)
            )
        ]
        db.add_all(events)
        
        await db.commit()
    
    print("Database seeded successfully with 2026 intelligence data!")

if __name__ == "__main__":
    asyncio.run(seed_data())
