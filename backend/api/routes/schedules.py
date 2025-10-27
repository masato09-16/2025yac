"""
Class schedule API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database.session import get_db
from database.models.schedule import ClassSchedule, DAY_SHORT_NAMES
from api.models.schedule import (
    ClassScheduleResponse,
    ClassScheduleCreate,
    ClassScheduleUpdate,
    ClassScheduleWithStatus,
)

router = APIRouter(prefix="/schedules", tags=["schedules"])


@router.get("/", response_model=List[ClassScheduleResponse])
def get_all_schedules(
    classroom_id: Optional[str] = Query(None, description="Filter by classroom ID"),
    day_of_week: Optional[int] = Query(None, ge=0, le=6, description="Filter by day (0=Monday, 6=Sunday)"),
    period: Optional[int] = Query(None, ge=1, le=7, description="Filter by period"),
    db: Session = Depends(get_db),
):
    """Get all class schedules with optional filters"""
    query = db.query(ClassSchedule)
    
    if classroom_id:
        query = query.filter(ClassSchedule.classroom_id == classroom_id)
    if day_of_week is not None:
        query = query.filter(ClassSchedule.day_of_week == day_of_week)
    if period is not None:
        query = query.filter(ClassSchedule.period == period)
    
    schedules = query.all()
    return schedules


@router.get("/active", response_model=List[ClassScheduleWithStatus])
def get_active_schedules(
    current_time: Optional[str] = Query(None, description="ISO format datetime (defaults to now)"),
    db: Session = Depends(get_db),
):
    """Get schedules that are currently active"""
    if current_time:
        try:
            check_time = datetime.fromisoformat(current_time)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO format.")
    else:
        check_time = datetime.now()
    
    all_schedules = db.query(ClassSchedule).all()
    
    result = []
    for schedule in all_schedules:
        is_active = schedule.is_active_now(check_time)
        result.append(ClassScheduleWithStatus(
            schedule=schedule,
            is_active_now=is_active
        ))
    
    # Filter to only active schedules
    return [s for s in result if s.is_active_now]


@router.get("/classroom/{classroom_id}", response_model=List[ClassScheduleResponse])
def get_classroom_schedules(
    classroom_id: str,
    day_of_week: Optional[int] = Query(None, ge=0, le=6, description="Filter by day"),
    db: Session = Depends(get_db),
):
    """Get all schedules for a specific classroom"""
    query = db.query(ClassSchedule).filter(ClassSchedule.classroom_id == classroom_id)
    
    if day_of_week is not None:
        query = query.filter(ClassSchedule.day_of_week == day_of_week)
    
    schedules = query.all()
    return schedules


@router.get("/{schedule_id}", response_model=ClassScheduleResponse)
def get_schedule(schedule_id: str, db: Session = Depends(get_db)):
    """Get a specific class schedule by ID"""
    schedule = db.query(ClassSchedule).filter(ClassSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.post("/", response_model=ClassScheduleResponse, status_code=201)
def create_schedule(
    schedule: ClassScheduleCreate,
    db: Session = Depends(get_db),
):
    """Create a new class schedule"""
    import uuid
    
    # Generate ID
    schedule_id = f"sched-{uuid.uuid4().hex[:12]}"
    
    db_schedule = ClassSchedule(
        id=schedule_id,
        **schedule.model_dump()
    )
    
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule


@router.put("/{schedule_id}", response_model=ClassScheduleResponse)
def update_schedule(
    schedule_id: str,
    schedule_update: ClassScheduleUpdate,
    db: Session = Depends(get_db),
):
    """Update a class schedule"""
    db_schedule = db.query(ClassSchedule).filter(ClassSchedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    # Update fields
    update_data = schedule_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_schedule, field, value)
    
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule


@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: str, db: Session = Depends(get_db)):
    """Delete a class schedule"""
    db_schedule = db.query(ClassSchedule).filter(ClassSchedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    db.delete(db_schedule)
    db.commit()
    
    return {"message": "Schedule deleted successfully"}

