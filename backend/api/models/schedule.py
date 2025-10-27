"""
Pydantic models for class schedule API
"""
from pydantic import BaseModel
from typing import Optional
from datetime import time


class ClassScheduleBase(BaseModel):
    """Base class schedule model"""
    classroom_id: str
    class_name: str
    instructor: Optional[str] = None
    day_of_week: int  # 0=Monday, 6=Sunday
    period: int
    start_time: time
    end_time: time
    semester: Optional[str] = None
    course_code: Optional[str] = None


class ClassScheduleCreate(ClassScheduleBase):
    """Model for creating a class schedule"""
    pass


class ClassScheduleUpdate(BaseModel):
    """Model for updating a class schedule"""
    class_name: Optional[str] = None
    instructor: Optional[str] = None
    day_of_week: Optional[int] = None
    period: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    semester: Optional[str] = None
    course_code: Optional[str] = None


class ClassScheduleResponse(ClassScheduleBase):
    """Model for class schedule response"""
    id: str
    
    class Config:
        from_attributes = True


class ClassScheduleWithStatus(BaseModel):
    """Class schedule with current status"""
    schedule: ClassScheduleResponse
    is_active_now: bool  # Whether the class is currently in session
    
    class Config:
        from_attributes = True

