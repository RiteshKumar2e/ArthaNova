
import asyncio
import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import AsyncSessionLocal
from app.api.v1.auth import authenticate_user
from app.schemas.schemas import UserLoginRequest

async def test_auth():
    print("🧪 Testing Authentication Service...")
    async with AsyncSessionLocal() as session:
        try:
            # Test with correct credentials
            user = await authenticate_user(session, "user@arthanova.in", "Demo@1234")
            if user:
                print(f"✅ Auth successful for: {user.email}")
            else:
                print("❌ Auth failed (Invalid credentials)")
        except Exception as e:
            import traceback
            print("🚨 CRITICAL ERROR DURING AUTH:")
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_auth())
