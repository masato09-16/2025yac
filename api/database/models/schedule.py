"""
Class schedule database model
"""
from sqlalchemy import Column, String, Integer, DateTime, func, ForeignKey, Time
from sqlalchemy.orm import relationship
from ..session import Base
from datetime import datetime, time
from typing import Optional


class ClassSchedule(Base):
    """Class schedule model for tracking scheduled classes"""
    
    __tablename__ = "class_schedules"
    
    id = Column(String, primary_key=True, index=True)
    classroom_id = Column(String, ForeignKey("classrooms.id"), nullable=False, index=True)
    
    # Class information
    class_name = Column(String, nullable=False)  # 授業名
    instructor = Column(String, nullable=True)   # 教員名
    
    # Schedule information
    day_of_week = Column(Integer, nullable=False, index=True)  # 0=Monday, 6=Sunday
    period = Column(Integer, nullable=False)     # 時限 (1-7)
    start_time = Column(Time, nullable=False)    # 開始時刻
    end_time = Column(Time, nullable=False)      # 終了時刻
    
    # Optional metadata
    semester = Column(String, nullable=True)     # 前期/後期/通年
    course_code = Column(String, nullable=True)  # 授業コード
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    classroom = relationship("Classroom", back_populates="schedules")
    
    def is_active_now(self, current_datetime: Optional[datetime] = None) -> bool:
        """
        Check if this class is currently in session
        
        Args:
            current_datetime: Datetime to check (defaults to now)
        
        Returns:
            True if the class is currently in session
        """
        if current_datetime is None:
            current_datetime = datetime.now()
        
        # Check day of week (0=Monday, 6=Sunday)
        if current_datetime.weekday() != self.day_of_week:
            return False
        
        # Check time
        current_time = current_datetime.time()
        return self.start_time <= current_time <= self.end_time
    
    def __repr__(self):
        return f"<ClassSchedule {self.class_name} on {self.day_of_week} period {self.period}>"


# Period time mapping (横浜国立大学の標準時限)
PERIOD_TIMES = {
    1: (time(8, 50), time(10, 20)),   # 1時限
    2: (time(10, 30), time(12, 0)),   # 2時限
    3: (time(13, 0), time(14, 30)),   # 3時限
    4: (time(14, 40), time(16, 10)),  # 4時限
    5: (time(16, 20), time(17, 50)),  # 5時限
    6: (time(18, 0), time(19, 30)),   # 6時限
    7: (time(19, 40), time(21, 10)),  # 7時限
}

# Day of week mapping
DAY_NAMES = {
    0: "月曜日",
    1: "火曜日",
    2: "水曜日",
    3: "木曜日",
    4: "金曜日",
    5: "土曜日",
    6: "日曜日",
}

DAY_SHORT_NAMES = {
    0: "月",
    1: "火",
    2: "水",
    3: "木",
    4: "金",
    5: "土",
    6: "日",
}

