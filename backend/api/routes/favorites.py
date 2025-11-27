"""
Favorites API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from database.session import get_db
from database.models.user import Favorite, User
from database.models.classroom import Classroom
from api.routes.auth import session_store

router = APIRouter(prefix="/favorites", tags=["favorites"])


def get_current_user_id(token: Optional[str] = Query(None)) -> str:
    """Get current user ID from token"""
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if token not in session_store:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = session_store[token].get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user_id


class FavoriteResponse(BaseModel):
    """Favorite response model"""
    id: str
    classroom_id: str
    classroom: dict
    created_at: str
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[FavoriteResponse])
async def get_favorites(
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get user's favorite classrooms"""
    user_id = get_current_user_id(token)
    
    favorites = db.query(Favorite).filter(Favorite.user_id == user_id).all()
    
    result = []
    for fav in favorites:
        classroom = db.query(Classroom).filter(Classroom.id == fav.classroom_id).first()
        if classroom:
            result.append({
                "id": fav.id,
                "classroom_id": fav.classroom_id,
                "classroom": {
                    "id": classroom.id,
                    "room_number": classroom.room_number,
                    "building_id": classroom.building_id,
                    "faculty": classroom.faculty,
                    "floor": classroom.floor,
                    "capacity": classroom.capacity,
                    "has_projector": classroom.has_projector,
                    "has_wifi": classroom.has_wifi,
                    "has_power_outlets": classroom.has_power_outlets,
                },
                "created_at": str(fav.created_at),
            })
    
    return result


@router.post("/{classroom_id}")
async def add_favorite(
    classroom_id: str,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Add classroom to favorites"""
    user_id = get_current_user_id(token)
    
    # Check if classroom exists
    classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.classroom_id == classroom_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    
    # Create favorite
    favorite = Favorite(
        id=f"fav_{user_id}_{classroom_id}",
        user_id=user_id,
        classroom_id=classroom_id,
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    
    return {"message": "Added to favorites", "id": favorite.id}


@router.delete("/{classroom_id}")
async def remove_favorite(
    classroom_id: str,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Remove classroom from favorites"""
    user_id = get_current_user_id(token)
    
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.classroom_id == classroom_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Removed from favorites"}


@router.get("/check/{classroom_id}")
async def check_favorite(
    classroom_id: str,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Check if classroom is in favorites"""
    try:
        user_id = get_current_user_id(token)
        favorite = db.query(Favorite).filter(
            Favorite.user_id == user_id,
            Favorite.classroom_id == classroom_id
        ).first()
        return {"is_favorite": favorite is not None}
    except HTTPException:
        return {"is_favorite": False}

