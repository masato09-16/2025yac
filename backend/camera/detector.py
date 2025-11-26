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
    
    def __init__(self, model_path: str = "yolov8n.pt"):
        """Initialize YOLO detector"""
        try:
            from ultralytics import YOLO
            self.model = YOLO(model_path)
            self.model_path = model_path
            logger.info(f"YOLO model loaded: {model_path}")
        except ImportError:
            logger.error("ultralytics not installed. Falling back to HOG detector.")
            self.model = None
            self.hog_detector = PersonDetector()
        except Exception as e:
            logger.error(f"Error loading YOLO model: {e}. Falling back to HOG detector.")
            self.model = None
            self.hog_detector = PersonDetector()
        
    def detect(self, image: np.ndarray) -> Tuple[int, float]:
        """
        Detect people using YOLO (class_id=0 for person)
        
        Args:
            image: Input image as numpy array (BGR format)
            
        Returns:
            Tuple of (count, average_confidence)
        """
        if self.model is None:
            # Fallback to HOG
            return self.hog_detector.detect(image)
        
        try:
            # YOLOv8 expects RGB format, but OpenCV uses BGR
            # Convert BGR to RGB
            if len(image.shape) == 3:
                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            else:
                image_rgb = image
            
            # Run inference
            results = self.model(image_rgb, verbose=False)
            
            # Filter for person class (class_id=0)
            person_count = 0
            confidences = []
            
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        # Check if class_id is 0 (person)
                        if int(box.cls) == 0:
                            person_count += 1
                            confidences.append(float(box.conf))
            
            avg_confidence = np.mean(confidences) if len(confidences) > 0 else 0.0
            
            return person_count, avg_confidence
            
        except Exception as e:
            logger.error(f"Error in YOLO detection: {e}")
            # Fallback to HOG
            if hasattr(self, 'hog_detector'):
                return self.hog_detector.detect(image)
            return 0, 0.0
    
    def detect_with_annotations(self, image: np.ndarray) -> Tuple[np.ndarray, int, float]:
        """
        Detect people and return annotated image with bounding boxes
        
        Args:
            image: Input image as numpy array (BGR format)
            
        Returns:
            Tuple of (annotated_image, count, average_confidence)
        """
        if self.model is None:
            # Fallback to HOG
            count, confidence = self.hog_detector.detect(image)
            # Draw HOG detections (simple rectangles)
            annotated = image.copy()
            return annotated, count, confidence
        
        try:
            # YOLOv8 expects RGB format
            if len(image.shape) == 3:
                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            else:
                image_rgb = image
            
            # Run inference
            results = self.model(image_rgb, verbose=False)
            
            # Get annotated image (YOLO returns annotated image in RGB)
            annotated_rgb = results[0].plot()
            
            # Convert back to BGR for OpenCV
            annotated = cv2.cvtColor(annotated_rgb, cv2.COLOR_RGB2BGR)
            
            # Count people (class_id=0)
            person_count = 0
            confidences = []
            
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        if int(box.cls) == 0:
                            person_count += 1
                            confidences.append(float(box.conf))
            
            avg_confidence = np.mean(confidences) if len(confidences) > 0 else 0.0
            
            return annotated, person_count, avg_confidence
            
        except Exception as e:
            logger.error(f"Error in YOLO detection with annotations: {e}")
            # Fallback to HOG
            if hasattr(self, 'hog_detector'):
                count, confidence = self.hog_detector.detect(image)
                annotated = image.copy()
                return annotated, count, confidence
            return image.copy(), 0, 0.0


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

