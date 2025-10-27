"""
Occupancy database models
"""
from sqlalchemy import Column, String, Integer, DateTime, func, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.session import Base


class Occupancy(Base):
    """Current occupancy status model"""
    
    __tablename__ = "occupancy"
    
    id = Column(String, primary_key=True, index=True)
    classroom_id = Column(String, ForeignKey("classrooms.id"), nullable=False, unique=True, index=True)
    current_count = Column(Integer, nullable=False, default=0)
    detection_confidence = Column(Float, nullable=False, default=0.0)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    camera_id = Column(String, nullable=True)
    
    # Relationships
    classroom = relationship("Classroom", back_populates="occupancy")
    
    # Computed status
    @property
    def is_available(self) -> bool:
        """Check if classroom is available (occupancy < 50% of capacity)"""
        if not self.classroom:
            return False
        threshold = self.classroom.capacity * 0.5
        return self.current_count < threshold
    
    @property
    def occupancy_rate(self) -> float:
        """Calculate occupancy rate (0-1)"""
        if not self.classroom:
            return 0.0
        if self.classroom.capacity == 0:
            return 0.0
        return min(self.current_count / self.classroom.capacity, 1.0)


class OccupancyHistory(Base):
    """Historical occupancy data"""
    
    __tablename__ = "occupancy_history"
    
    id = Column(String, primary_key=True, index=True)
    classroom_id = Column(String, ForeignKey("classrooms.id"), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    count = Column(Integer, nullable=False)
    detection_confidence = Column(Float, nullable=False)
    camera_id = Column(String, nullable=True)
    
    # Relationships
    classroom = relationship("Classroom", back_populates="occupancy_history")

