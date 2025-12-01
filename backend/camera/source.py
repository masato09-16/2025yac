"""
Camera source abstraction for PC and Raspberry Pi compatibility
"""
import cv2
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class CameraSource:
    """カメラソースの抽象化クラス
    
    PCカメラとラズベリーパイカメラを統一インターフェースで扱います。
    環境変数でカメラタイプを切り替えることで、コード変更なしで
    異なる環境に対応できます。
    """
    
    @staticmethod
    def get_camera(camera_type: str, camera_source: str) -> cv2.VideoCapture:
        """環境に応じたカメラオブジェクトを返す
        
        Args:
            camera_type: カメラタイプ ("pc" または "raspberry_pi")
            camera_source: カメラソース
                - PC: デバイスID (例: "0", "1", "2")
                - Raspberry Pi: デバイスパスまたはURL (例: "/dev/video0")
        
        Returns:
            cv2.VideoCapture: カメラオブジェクト
            
        Raises:
            ValueError: 不明なカメラタイプの場合
        """
        logger.info(f"Initializing camera: type={camera_type}, source={camera_source}")
        
        if camera_type == "pc":
            # PCカメラ: デバイスIDを整数に変換
            try:
                device_id = int(camera_source)
                cap = cv2.VideoCapture(device_id)
                logger.info(f"PC camera initialized with device ID: {device_id}")
                return cap
            except ValueError:
                logger.error(f"Invalid PC camera device ID: {camera_source}")
                raise ValueError(f"PC camera source must be a numeric device ID, got: {camera_source}")
                
        elif camera_type == "raspberry_pi":
            # ラズベリーパイ: デバイスパスまたはURLを使用
            cap = cv2.VideoCapture(camera_source)
            logger.info(f"Raspberry Pi camera initialized with source: {camera_source}")
            return cap
            
        else:
            raise ValueError(f"Unknown camera type: {camera_type}. Use 'pc' or 'raspberry_pi'")
    
    @staticmethod
    def test_camera(camera_type: str, camera_source: str) -> bool:
        """カメラが正常に動作するかテストする
        
        Args:
            camera_type: カメラタイプ
            camera_source: カメラソース
            
        Returns:
            bool: カメラが正常に動作する場合True
        """
        try:
            cap = CameraSource.get_camera(camera_type, camera_source)
            
            if not cap.isOpened():
                logger.error(f"Failed to open camera: type={camera_type}, source={camera_source}")
                return False
            
            # テストフレームを読み取る
            ret, frame = cap.read()
            cap.release()
            
            if not ret or frame is None:
                logger.error(f"Failed to read frame from camera: type={camera_type}, source={camera_source}")
                return False
            
            logger.info(f"Camera test successful: type={camera_type}, source={camera_source}")
            return True
            
        except Exception as e:
            logger.error(f"Camera test failed: {e}")
            return False
