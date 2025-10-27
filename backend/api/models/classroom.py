"""
Classroom Pydantic models for API
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ClassroomResponse(BaseModel):
    """Classroom response model"""
    id: str
    room_number: str
    building_id: str
    faculty: str
    floor: int
    capacity: int
    has_projector: bool
    has_wifi: bool
    has_power_outlets: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ClassroomCreate(BaseModel):
    """Classroom creation model"""
    id: str = Field(..., description="Unique classroom ID")
    room_number: str = Field(..., description="Room number")
    building_id: str = Field(..., description="Building ID")
    faculty: str = Field(..., description="Faculty name")
    floor: int = Field(..., ge=1, description="Floor number")
    capacity: int = Field(..., gt=0, description="Room capacity")
    has_projector: bool = Field(default=False, description="Has projector")
    has_wifi: bool = Field(default=True, description="Has Wi-Fi")
    has_power_outlets: bool = Field(default=True, description="Has power outlets")


class ClassroomUpdate(BaseModel):
    """Classroom update model"""
    room_number: Optional[str] = None
    building_id: Optional[str] = None
    faculty: Optional[str] = None
    floor: Optional[int] = None
    capacity: Optional[int] = None
    has_projector: Optional[bool] = None
    has_wifi: Optional[bool] = None
    has_power_outlets: Optional[bool] = None

