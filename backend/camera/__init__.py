"""
Camera and detection package
"""
from .detector import PersonDetector, detect_people
from .processor import CameraProcessor

__all__ = ["PersonDetector", "detect_people", "CameraProcessor"]

