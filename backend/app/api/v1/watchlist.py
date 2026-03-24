"""ArthaNova — Watchlist management API."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.db.database import get_db
from app.models.user import User, Watchlist, WatchlistItem
from app.api.v1.auth import get_current_user
from app.schemas.schemas import WatchlistCreate, WatchlistResponse, WatchlistItemAdd, MessageResponse

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])


@router.get("/", response_model=List[WatchlistResponse])
async def get_watchlists(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all watchlists for the current user."""
    result = await db.execute(
        select(Watchlist).where(Watchlist.user_id == current_user.id)
    )
    watchlists = result.scalars().all()
    return watchlists


@router.post("/", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
async def create_watchlist(
    data: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new watchlist."""
    new_watchlist = Watchlist(
        user_id=current_user.id,
        name=data.name,
        description=data.description,
        is_default=False
    )
    db.add(new_watchlist)
    await db.commit()
    await db.refresh(new_watchlist)
    return new_watchlist


@router.get("/{watchlist_id}", response_model=WatchlistResponse)
async def get_watchlist(
    watchlist_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific watchlist with all its tracked symbols."""
    result = await db.execute(
        select(Watchlist).where(
            Watchlist.id == watchlist_id, 
            Watchlist.user_id == current_user.id
        )
    )
    watchlist = result.scalar_one_or_none()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    
    # Force load items if needed (scalars should already have them if relationship is defined)
    return watchlist


@router.delete("/{watchlist_id}", response_model=MessageResponse)
async def delete_watchlist(
    watchlist_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete an entire watchlist."""
    result = await db.execute(
        select(Watchlist).where(
            Watchlist.id == watchlist_id,
            Watchlist.user_id == current_user.id
        )
    )
    watchlist = result.scalar_one_or_none()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    await db.delete(watchlist)
    await db.commit()
    return {"message": "Watchlist deleted successfully", "success": True}


@router.post("/{watchlist_id}/items", response_model=WatchlistResponse)
async def add_item_to_watchlist(
    watchlist_id: int,
    data: WatchlistItemAdd,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a symbol to a specific watchlist."""
    # Verify ownership
    result = await db.execute(
        select(Watchlist).where(
            Watchlist.id == watchlist_id,
            Watchlist.user_id == current_user.id
        )
    )
    watchlist = result.scalar_one_or_none()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    # Check if already exists in this watchlist
    item_check = await db.execute(
        select(WatchlistItem).where(
            WatchlistItem.watchlist_id == watchlist_id,
            WatchlistItem.symbol == data.symbol
        )
    )
    if item_check.scalar_one_or_none():
        raise HTTPException(status_code=400, detail=f"Symbol {data.symbol} is already in this watchlist")

    new_item = WatchlistItem(
        watchlist_id=watchlist_id,
        symbol=data.symbol,
        company_name=data.company_name
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(watchlist)
    return watchlist


@router.delete("/{watchlist_id}/items/{item_id}", response_model=WatchlistResponse)
async def remove_item_from_watchlist(
    watchlist_id: int,
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove a symbol from a watchlist."""
    # Verify ownership
    result = await db.execute(
        select(Watchlist).where(
            Watchlist.id == watchlist_id,
            Watchlist.user_id == current_user.id
        )
    )
    watchlist = result.scalar_one_or_none()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    item_result = await db.execute(
        select(WatchlistItem).where(
            WatchlistItem.id == item_id,
            WatchlistItem.watchlist_id == watchlist_id
        )
    )
    item = item_result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")

    await db.delete(item)
    await db.commit()
    await db.refresh(watchlist)
    return watchlist
