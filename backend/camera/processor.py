"""
Camera processing and occupancy updates
"""
import asyncio
import logging
from typing import Optional
from datetime import datetime
from database.session import SessionLocal
from database.models.occupancy import Occupancy, OccupancyHistory
from database.models.classroom import Classroom
from .detector import PersonDetector
from config import settings

logger = logging.getLogger(__name__)


class CameraProcessor:
    """Process camera feeds and update occupancy data"""
    
    def __init__(self):
        """Initialize camera processor"""
        self.detector = PersonDetector()
        self.running = False
        
    async def update_classroom_occupancy(
        self,
        classroom_id: str,
        camera_url: Optional[str] = None,
        count: Optional[int] = None,
        confidence: Optional[float] = None
    ):
        """
        Update occupancy for a specific classroom
        
        Args:
            classroom_id: ID of the classroom
            camera_url: URL of camera feed (optional)
            count: Manual count override (optional)
            confidence: Manual confidence override (optional)
        """
        db = SessionLocal()
        try:
            # Get or create occupancy record
            occupancy = db.query(Occupancy).filter(Occupancy.classroom_id == classroom_id).first()
            
            if occupancy is None:
                occupancy = Occupancy(
                    id=f"occ_{classroom_id}",
                    classroom_id=classroom_id,
                    current_count=0,
                    detection_confidence=0.0,
                )
                db.add(occupancy)
            
            # If camera URL provided, detect from image
            if camera_url:
                detection_count, detection_confidence = await self._detect_from_url(camera_url)
                count = detection_count
                confidence = detection_confidence
            
            # Update occupancy if values provided
            if count is not None:
                occupancy.current_count = count
            if confidence is not None:
                occupancy.detection_confidence = confidence
            
            occupancy.last_updated = datetime.utcnow()
            
            # Create history entry
            history = OccupancyHistory(
                id=f"hist_{classroom_id}_{datetime.utcnow().timestamp()}",
                classroom_id=classroom_id,
                timestamp=datetime.utcnow(),
                count=occupancy.current_count,
                detection_confidence=occupancy.detection_confidence,
                camera_id=None,
            )
            db.add(history)
            
            db.commit()
            logger.info(f"Updated occupancy for classroom {classroom_id}: count={count}, confidence={confidence}")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating occupancy for {classroom_id}: {e}")
        finally:
            db.close()
    
    async def _detect_from_url(self, url: str) -> tuple[int, float]:
        """
        Detect people from camera URL
        
        Args:
            url: Camera URL
            
        Returns:
            Tuple of (count, confidence)
        """
        try:
            import cv2
            cap = cv2.VideoCapture(url)
            ret, frame = cap.read()
            cap.release()
            
            if ret:
                count, confidence = self.detector.detect(frame)
                return count, confidence
            else:
                logger.warning(f"Could not read frame from {url}")
                return 0, 0.0
        except Exception as e:
            logger.error(f"Error detecting from URL {url}: {e}")
            return 0, 0.0
    
    async def process_all_classrooms(self):
        """Process all classrooms with cameras"""
        db = SessionLocal()
        try:
            classrooms = db.query(Classroom).all()
            
            for classroom in classrooms:
                # Here you would get the actual camera URL for this classroom
                # For now, we'll skip or use a placeholder
                await asyncio.sleep(0.1)  # Rate limiting
                
        except Exception as e:
            logger.error(f"Error processing all classrooms: {e}")
        finally:
            db.close()
    
    async def run_continuous_updates(self, interval: int):
        """Run continuous updates at specified interval"""
        self.running = True
        
        while self.running:
            try:
                await self.process_all_classrooms()
            except Exception as e:
                logger.error(f"Error in continuous updates: {e}")
            
            await asyncio.sleep(interval)
    
    def stop(self):
        """Stop continuous updates"""
        self.running = False

