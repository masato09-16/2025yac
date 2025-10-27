"""
Person detection using computer vision
"""
import cv2
import numpy as np
from typing import List, Tuple, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class PersonDetector:
    """Detect people in images using OpenCV"""
    
    def __init__(self, model_path: Optional[str] = None):
        """Initialize person detector"""
        self.model_path = model_path
        self.hog_detector = cv2.HOGDescriptor()
        self.hog_detector.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        
    def detect(self, image: np.ndarray) -> Tuple[int, float]:
        """
        Detect people in an image
        
        Args:
            image: Input image as numpy array
            
        Returns:
            Tuple of (count, average_confidence)
        """
        try:
            # Convert to grayscale if needed
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            else:
                gray = image
            
            # Detect people
            rects, weights = self.hog_detector.detectMultiScale(
                gray,
                winStride=(4, 4),
                padding=(8, 8),
                scale=1.05,
                finalThreshold=2.0,
            )
            
            count = len(rects)
            avg_confidence = np.mean(weights) if len(weights) > 0 else 0.0
            
            return count, avg_confidence
            
        except Exception as e:
            logger.error(f"Error detecting people: {e}")
            return 0, 0.0


class YOLODetector:
    """YOLO-based person detector (for production use)"""
    
    def __init__(self, model_path: str):
        """Initialize YOLO detector"""
        # This would load a YOLO model if available
        # For now, fallback to HOG
        self.hog_detector = PersonDetector()
        
    def detect(self, image: np.ndarray) -> Tuple[int, float]:
        """Detect people using YOLO"""
        # Implement YOLO detection here
        # For now, use HOG
        return self.hog_detector.detect(image)


def detect_people(image_path: str) -> Tuple[int, float]:
    """
    Convenience function to detect people in an image file
    
    Args:
        image_path: Path to image file
        
    Returns:
        Tuple of (count, confidence)
    """
    image = cv2.imread(image_path)
    if image is None:
        logger.error(f"Could not read image: {image_path}")
        return 0, 0.0
    
    detector = PersonDetector()
    return detector.detect(image)

