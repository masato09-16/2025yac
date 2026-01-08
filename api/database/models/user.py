"""
User and authentication models
"""
from sqlalchemy import Column, String, Integer, DateTime, func, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..session import Base


class User(Base):
    """User model for Google OAuth authentication"""
    
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)  # Google user ID
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    picture = Column(String, nullable=True)  # Profile picture URL
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    search_history = relationship("SearchHistory", back_populates="user", cascade="all, delete-orphan")


class Favorite(Base):
    """User's favorite classrooms"""
    
    __tablename__ = "favorites"
    __table_args__ = (
        UniqueConstraint('user_id', 'classroom_id', name='uq_user_classroom_favorite'),
    )
    
    id = Column(String, primary_key=True, index=True)  # Format: fav_{user_id}_{classroom_id}
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_id = Column(String, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    classroom = relationship("Classroom", foreign_keys=[classroom_id], primaryjoin="Favorite.classroom_id == Classroom.id")


class SearchHistory(Base):
    """User's search history"""
    
    __tablename__ = "search_history"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Search parameters (stored as JSON-like string or separate columns)
    faculty = Column(String, nullable=True)
    building_id = Column(String, nullable=True)
    status = Column(String, nullable=True)
    search_mode = Column(String, nullable=False)  # 'now' or 'future'
    target_date = Column(String, nullable=True)  # YYYY-MM-DD format
    target_period = Column(Integer, nullable=True)  # 1-5
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="search_history")

