
import asyncio
import sys
import os
import logging

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.db.database import AsyncSessionLocal
from app.models.user import User

# Silencing logging
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

async def verify():
    print("🔍 [CHECK] VERIFYING USERS...")
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(User))
        users = res.scalars().all()
        
        if not users:
            print("❌ NO USERS FOUND!")
            return
            
        for u in users:
            print(f"> {u.email} | ID:{u.id} | Active:{u.is_active} | Verified:{u.is_verified}")

if __name__ == "__main__":
    asyncio.run(verify())
