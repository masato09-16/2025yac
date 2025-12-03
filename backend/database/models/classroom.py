"""
Classroom database model
"""
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database.session import Base


class Classroom(Base):
    """Classroom model"""
    
    __tablename__ = "classrooms"
    
    id = Column(String, primary_key=True, index=True)
    room_number = Column(String, nullable=False, index=True)
    building_id = Column(String, ForeignKey("buildings.id"), nullable=False)
    faculty = Column(String, nullable=False, index=True)
    floor = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)
    has_projector = Column(Boolean, default=False)
    has_wifi = Column(Boolean, default=True)
    has_power_outlets = Column(Boolean, default=True)
    
    # Relationships
    occupancy = relationship("Occupancy", back_populates="classroom", uselist=False)
    occupancy_history = relationship("OccupancyHistory", back_populates="classroom")
    schedules = relationship("ClassSchedule", back_populates="classroom")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Building(Base):
    """Building model"""
    
    __tablename__ = "buildings"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    faculty = Column(String, nullable=False)
    floors = Column(String, nullable=False)  # JSON array as string
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

