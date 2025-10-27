"""
Classroom management API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database.session import get_db
from database.models.classroom import Classroom as DBClassroom
from api.models.classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate

router = APIRouter(prefix="/classrooms", tags=["classrooms"])


@router.get("/", response_model=List[ClassroomResponse])
async def get_classrooms(
    faculty: Optional[str] = Query(None, description="Filter by faculty"),
    building_id: Optional[str] = Query(None, description="Filter by building ID"),
    floor: Optional[int] = Query(None, description="Filter by floor"),
    db: Session = Depends(get_db)
):
    """Get all classrooms with optional filters"""
    query = db.query(DBClassroom)
    
    if faculty:
        query = query.filter(DBClassroom.faculty == faculty)
    if building_id:
        query = query.filter(DBClassroom.building_id == building_id)
    if floor:
        query = query.filter(DBClassroom.floor == floor)
    
    classrooms = query.all()
    return classrooms


@router.get("/{classroom_id}", response_model=ClassroomResponse)
async def get_classroom(classroom_id: str, db: Session = Depends(get_db)):
    """Get a specific classroom by ID"""
    classroom = db.query(DBClassroom).filter(DBClassroom.id == classroom_id).first()
    
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    return classroom


@router.post("/", response_model=ClassroomResponse)
async def create_classroom(
    classroom_data: ClassroomCreate,
    db: Session = Depends(get_db)
):
    """Create a new classroom"""
    # Check if classroom already exists
    existing = db.query(DBClassroom).filter(DBClassroom.id == classroom_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Classroom already exists")
    
    db_classroom = DBClassroom(**classroom_data.dict())
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    
    return db_classroom


@router.put("/{classroom_id}", response_model=ClassroomResponse)
async def update_classroom(
    classroom_id: str,
    classroom_data: ClassroomUpdate,
    db: Session = Depends(get_db)
):
    """Update a classroom"""
    classroom = db.query(DBClassroom).filter(DBClassroom.id == classroom_id).first()
    
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    # Update only provided fields
    update_data = classroom_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(classroom, key, value)
    
    db.commit()
    db.refresh(classroom)
    
    return classroom


@router.delete("/{classroom_id}")
async def delete_classroom(classroom_id: str, db: Session = Depends(get_db)):
    """Delete a classroom"""
    classroom = db.query(DBClassroom).filter(DBClassroom.id == classroom_id).first()
    
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    db.delete(classroom)
    db.commit()
    
    return {"message": "Classroom deleted successfully"}

