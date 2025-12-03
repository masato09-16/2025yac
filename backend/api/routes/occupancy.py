"""
Occupancy management API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from database.session import get_db
from database.models.occupancy import Occupancy as DBOccupancy, OccupancyHistory
from database.models.classroom import Classroom
from database.models.schedule import ClassSchedule
from api.models.occupancy import OccupancyResponse, OccupancyUpdate, ClassroomWithOccupancy

router = APIRouter(prefix="/occupancy", tags=["occupancy"])


@router.get("/", response_model=List[OccupancyResponse])
async def get_occupancy(
    faculty: Optional[str] = Query(None, description="Filter by faculty"),
    building_id: Optional[str] = Query(None, description="Filter by building ID"),
    available_only: bool = Query(False, description="Show only available classrooms"),
    db: Session = Depends(get_db)
):
    """Get all occupancy status"""
    query = db.query(DBOccupancy)
    
    # Join with classroom for filtering
    query = query.join(Classroom, DBOccupancy.classroom_id == Classroom.id)
    
    if faculty:
        query = query.filter(Classroom.faculty == faculty)
    if building_id:
        query = query.filter(Classroom.building_id == building_id)
    
    occupancies = query.all()
    
    if available_only:
        occupancies = [occ for occ in occupancies if occ.is_available]
    
    return occupancies


@router.get("/classroom/{classroom_id}", response_model=OccupancyResponse)
async def get_classroom_occupancy(classroom_id: str, db: Session = Depends(get_db)):
    """Get occupancy status for a specific classroom"""
    occupancy = db.query(DBOccupancy).filter(DBOccupancy.classroom_id == classroom_id).first()
    
    if not occupancy:
        raise HTTPException(status_code=404, detail="Occupancy not found")
    
    return occupancy


@router.get("/classrooms-with-status", response_model=List[ClassroomWithOccupancy])
async def get_classrooms_with_status(
    faculty: Optional[str] = Query(None, description="Filter by faculty"),
    building_id: Optional[str] = Query(None, description="Filter by building ID"),
    target_date: Optional[str] = Query(None, description="Target date (YYYY-MM-DD)"),
    target_period: Optional[int] = Query(None, description="Target period (1-5)"),
    db: Session = Depends(get_db)
):
    """Get classrooms with their occupancy status and class schedule information
    
    If target_date and target_period are provided, check schedule for that specific time.
    Otherwise, check current time status.
    
    OPTIMIZED: Uses eager loading to prevent N+1 queries
    """
    from sqlalchemy.orm import joinedload
    
    # Eager load occupancy and schedules to prevent N+1 queries
    query = db.query(Classroom).options(
        joinedload(Classroom.occupancy),
        joinedload(Classroom.schedules)
    )
    
    if faculty:
        query = query.filter(Classroom.faculty == faculty)
    if building_id:
        query = query.filter(Classroom.building_id == building_id)
    
    classrooms = query.all()
    
    # Determine which time to check
    use_future_time = target_date and target_period
    
    if use_future_time:
        # Parse target date and get day of week
        try:
            target_datetime = datetime.strptime(target_date, "%Y-%m-%d")
            # 0=Monday, 6=Sunday in Python
            day_of_week_num = target_datetime.weekday()
            day_names = ["月", "火", "水", "木", "金", "土", "日"]
            target_day = day_names[day_of_week_num]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    else:
        current_time = datetime.now()
    
    result = []
    for classroom in classrooms:
        # Occupancy is already loaded via joinedload - no additional query
        occupancy = classroom.occupancy
        
        # Schedules are already loaded via joinedload - no additional query
        all_schedules = classroom.schedules
        active_schedule = None
        
        if use_future_time:
            # Check for future date schedule
            for schedule in all_schedules:
                if schedule.day_of_week == target_day and schedule.period == target_period:
                    active_schedule = schedule
                    break
        else:
            # Check current time
            for schedule in all_schedules:
                if schedule.is_active_now(current_time):
                    active_schedule = schedule
                    break
        
        # Determine detailed status
        current_count = occupancy.current_count if occupancy else 0
        occupancy_rate = occupancy.occupancy_rate if occupancy else 0.0
        
        # Status logic differs for future vs current time
        if use_future_time:
            # For future time, only check schedule (no occupancy data available)
            if active_schedule:
                status = "in-class"
                status_detail = f"授業予定: {active_schedule.class_name}"
            else:
                status = "available"
                status_detail = "空き教室"
            is_available = (status == "available")
        else:
            # For current time, use both schedule and occupancy
            # Status logic:
            # 1. If class is scheduled AND people are present -> "in-class" (授業中)
            # 2. If class is scheduled BUT few people -> "scheduled-low" (授業予定だが人少ない)
            # 3. If NO class scheduled BUT many people -> "occupied" (空き教室だが混雑)
            # 4. If NO class scheduled AND few people -> "available" (空き教室)
            
            if active_schedule:
                if occupancy_rate >= 0.1:  # 10% or more occupied
                    status = "in-class"
                    status_detail = f"授業中: {active_schedule.class_name}"
                else:
                    status = "scheduled-low"
                    status_detail = f"授業予定: {active_schedule.class_name}"
            else:
                if occupancy_rate >= 0.5:  # 50% or more occupied
                    status = "occupied"
                    status_detail = "空き教室（混雑）"
                elif occupancy_rate >= 0.1:  # 10-50% occupied
                    status = "partially-occupied"
                    status_detail = "空き教室（一部使用中）"
                else:
                    status = "available"
                    status_detail = "空き教室"
            
            is_available = (status in ["available", "partially-occupied"])
        
        # 解析結果画像のURLを構築（存在する場合）
        from pathlib import Path
        backend_dir = Path(__file__).parent.parent.parent
        processed_image_path = backend_dir / "static" / "processed" / f"{classroom.id}.jpg"
        image_url = f"/static/processed/{classroom.id}.jpg" if processed_image_path.exists() else None
        
        result.append({
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
            "occupancy": {
                "current_count": current_count,
                "detection_confidence": occupancy.detection_confidence if occupancy else 0.0,
                "last_updated": str(occupancy.last_updated) if occupancy else None,
            } if occupancy else None,
            "is_available": is_available,
            "occupancy_rate": occupancy_rate,
            "status": status,
            "status_detail": status_detail,
            "active_class": {
                "class_name": active_schedule.class_name,
                "instructor": active_schedule.instructor,
                "start_time": str(active_schedule.start_time),
                "end_time": str(active_schedule.end_time),
            } if active_schedule else None,
            "image_url": image_url,
        })
    
    return result


@router.post("/update", response_model=OccupancyResponse)
async def update_occupancy(
    occupancy_data: OccupancyUpdate,
    db: Session = Depends(get_db)
):
    """Update occupancy status for a classroom"""
    # Check if classroom exists
    classroom = db.query(Classroom).filter(Classroom.id == occupancy_data.classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    # Check if occupancy exists
    occupancy = db.query(DBOccupancy).filter(DBOccupancy.classroom_id == occupancy_data.classroom_id).first()
    
    if occupancy:
        # Update existing
        occupancy.current_count = occupancy_data.current_count
        occupancy.detection_confidence = occupancy_data.detection_confidence
        if occupancy_data.camera_id:
            occupancy.camera_id = occupancy_data.camera_id
    else:
        # Create new
        occupancy = DBOccupancy(
            id=f"occ_{occupancy_data.classroom_id}",
            classroom_id=occupancy_data.classroom_id,
            current_count=occupancy_data.current_count,
            detection_confidence=occupancy_data.detection_confidence,
            camera_id=occupancy_data.camera_id,
        )
        db.add(occupancy)
    
    # Create history entry
    history = OccupancyHistory(
        id=f"hist_{occupancy.classroom_id}_{occupancy.last_updated}",
        classroom_id=occupancy.classroom_id,
        timestamp=occupancy.last_updated,
        count=occupancy.current_count,
        detection_confidence=occupancy.detection_confidence,
        camera_id=occupancy.camera_id,
    )
    db.add(history)
    
    db.commit()
    db.refresh(occupancy)
    
    return occupancy

