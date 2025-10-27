"""
API request/response models (Pydantic)
"""
from .classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate
from .occupancy import OccupancyResponse, OccupancyUpdate

__all__ = [
    "ClassroomResponse",
    "ClassroomCreate",
    "ClassroomUpdate",
    "OccupancyResponse",
    "OccupancyUpdate",
]

