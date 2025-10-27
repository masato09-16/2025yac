"""
Occupancy Pydantic models for API
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class OccupancyResponse(BaseModel):
    """Occupancy response model"""
    id: str
    classroom_id: str
    current_count: int
    detection_confidence: float
    last_updated: datetime
    camera_id: Optional[str] = None
    is_available: bool
    occupancy_rate: float
    
    class Config:
        from_attributes = True


class OccupancyUpdate(BaseModel):
    """Occupancy update model"""
    classroom_id: str = Field(..., description="Classroom ID")
    current_count: int = Field(..., ge=0, description="Current occupancy count")
    detection_confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence")
    camera_id: Optional[str] = Field(None, description="Camera ID")


class ClassroomWithOccupancy(BaseModel):
    """Classroom with occupancy status"""
    classroom: dict
    occupancy: Optional[dict] = None
    is_available: bool
    occupancy_rate: float
    status: str  # 'available' or 'in-use'

