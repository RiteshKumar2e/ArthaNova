
import asyncio
import sys
import os

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.db.database import AsyncSessionLocal
from app.models.user import User, UserRole, RiskProfile
from app.core.security import get_password_hash

async def seed_demo_users():
    print("🌱 Starting demo user seeding...")
    
    # 1. Hashing passwords properly
    user_pw = "Demo@1234"
    admin_pw = "Admin@1234"
    analyst_pw = "Analyst@1234"
    
    user_hash = get_password_hash(user_pw)
    admin_hash = get_password_hash(admin_pw)
    
    async with AsyncSessionLocal() as session:
        # User details list
        demo_accounts = [
            {
                "email": "user@arthanova.in",
                "username": "demouser",
                "full_name": "Demo User",
                "hashed_password": user_hash,
                "role": UserRole.USER,
                "is_active": True,
                "is_verified": True,
                "risk_profile": RiskProfile.MODERATE
            },
            {
                "email": "admin@arthanova.in",
                "username": "demoadmin",
                "full_name": "Demo Admin",
                "hashed_password": admin_hash,
                "role": UserRole.ADMIN,
                "is_admin": True,
                "is_active": True,
                "is_verified": True,
                "risk_profile": RiskProfile.AGGRESSIVE
            }
        ]

        for acc in demo_accounts:
            res = await session.execute(select(User).where(User.email == acc["email"]))
            user = res.scalar_one_or_none()
            
            if not user:
                user = User(**acc)
                session.add(user)
                print(f"✅ Created account: {acc['email']}")
            else:
                # Update existing user to ensure they have correct role/admin status
                user.is_active = True  # type: ignore
                user.is_verified = True  # type: ignore
                user.role = acc["role"]
                user.is_admin = acc.get("is_admin", False)
                user.hashed_password = acc["hashed_password"]
                print(f"ℹ️ Updated account status & permissions: {acc['email']}")

        await session.commit()
    
    print("🌿 Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_demo_users())
