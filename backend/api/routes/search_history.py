"""
Search history API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database.session import get_db
from database.models.user import SearchHistory, User
from api.routes.auth import verify_session_token

router = APIRouter(prefix="/search-history", tags=["search-history"])


def get_current_user_id(token: Optional[str] = Query(None)) -> str:
    """Get current user ID from JWT token"""
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Verify JWT session token
    session_data = verify_session_token(token)
    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = session_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user_id


class SearchHistoryCreate(BaseModel):
    """Search history creation model"""
    faculty: Optional[str] = None
    building_id: Optional[str] = None
    status: Optional[str] = None
    search_mode: str  # 'now' or 'future'
    target_date: Optional[str] = None  # YYYY-MM-DD format
    target_period: Optional[int] = None  # 1-5


class SearchHistoryResponse(BaseModel):
    """Search history response model"""
    id: str
    faculty: Optional[str]
    building_id: Optional[str]
    status: Optional[str]
    search_mode: str
    target_date: Optional[str]
    target_period: Optional[int]
    created_at: str
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[SearchHistoryResponse])
async def get_search_history(
    token: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get user's search history"""
    user_id = get_current_user_id(token)
    
    history = db.query(SearchHistory).filter(
        SearchHistory.user_id == user_id
    ).order_by(SearchHistory.created_at.desc()).limit(limit).all()
    
    return history


@router.post("/", response_model=SearchHistoryResponse)
async def save_search_history(
    history_data: SearchHistoryCreate,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Save search history"""
    user_id = get_current_user_id(token)
    
    # Generate ID
    timestamp = datetime.utcnow().isoformat().replace(":", "-").replace(".", "-")
    history_id = f"hist_{user_id}_{timestamp}"
    
    # Create search history
    history = SearchHistory(
        id=history_id,
        user_id=user_id,
        faculty=history_data.faculty,
        building_id=history_data.building_id,
        status=history_data.status,
        search_mode=history_data.search_mode,
        target_date=history_data.target_date,
        target_period=history_data.target_period,
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    
    return history


@router.delete("/{history_id}")
async def delete_search_history(
    history_id: str,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Delete search history entry"""
    user_id = get_current_user_id(token)
    
    history = db.query(SearchHistory).filter(
        SearchHistory.id == history_id,
        SearchHistory.user_id == user_id
    ).first()
    
    if not history:
        raise HTTPException(status_code=404, detail="Search history not found")
    
    db.delete(history)
    db.commit()
    
    return {"message": "Search history deleted"}


@router.delete("/")
async def clear_search_history(
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Clear all search history for user"""
    user_id = get_current_user_id(token)
    
    db.query(SearchHistory).filter(SearchHistory.user_id == user_id).delete()
    db.commit()
    
    return {"message": "Search history cleared"}

