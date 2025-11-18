"""
Face Recognition Services
Handles AI model integration and face processing
"""

import cv2
import numpy as np
from PIL import Image
import io
import base64
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class FaceDetectionService:
    """
    Face detection using multiple methods.
    Supports: OpenCV, InsightFace, dlib
    """
    
    def __init__(self):
        self.opencv_cascade = None
        self.insightface_detector = None
        self.dlib_detector = None
        self._initialize_detectors()
    
    def _initialize_detectors(self):
        """Initialize face detection models."""
        try:
            # OpenCV Haar Cascade
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.opencv_cascade = cv2.CascadeClassifier(cascade_path)
            logger.info("OpenCV face detector initialized")
        except Exception as e:
            logger.error(f"Failed to initialize OpenCV detector: {e}")
        
        try:
            # InsightFace detector
            import insightface
            self.insightface_detector = insightface.app.FaceAnalysis()
            self.insightface_detector.prepare(ctx_id=0, det_size=(640, 640))
            logger.info("InsightFace detector initialized")
        except Exception as e:
            logger.warning(f"InsightFace not available: {e}")
        
        try:
            # dlib detector
            import dlib
            self.dlib_detector = dlib.get_frontal_face_detector()
            logger.info("dlib face detector initialized")
        except Exception as e:
            logger.warning(f"dlib not available: {e}")
    
    def detect_faces(self, image_data: bytes) -> Dict:
        """
        Detect faces in image using multiple detectors.
        
        Args:
            image_data: Raw image bytes
            
        Returns:
            Dict with detection results
        """
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {'success': False, 'error': 'Invalid image data'}
        
        results = {
            'success': False,
            'faces_detected': 0,
            'detections': [],
            'image_size': img.shape,
        }
        
        # Try OpenCV detection
        if self.opencv_cascade is not None:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = self.opencv_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
            )
            if len(faces) > 0:
                results['success'] = True
                results['faces_detected'] = len(faces)
                for (x, y, w, h) in faces:
                    results['detections'].append({
                        'bbox': [int(x), int(y), int(w), int(h)],
                        'confidence': 0.8,
                        'method': 'opencv'
                    })
        
        # Try InsightFace detection
        if self.insightface_detector is not None:
            try:
                rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                faces = self.insightface_detector.get(rgb_img)
                if len(faces) > 0:
                    results['success'] = True
                    results['faces_detected'] = max(results['faces_detected'], len(faces))
                    for face in faces:
                        bbox = face.bbox.astype(int).tolist()
                        results['detections'].append({
                            'bbox': bbox,
                            'confidence': float(face.det_score),
                            'method': 'insightface',
                            'landmarks': face.landmark.tolist() if hasattr(face, 'landmark') else None
                        })
            except Exception as e:
                logger.error(f"InsightFace detection error: {e}")
        
        return results
    
    def calculate_image_quality(self, image_data: bytes) -> Dict:
        """
        Calculate image quality metrics.
        
        Args:
            image_data: Raw image bytes
            
        Returns:
            Dict with quality metrics
        """
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {'success': False, 'error': 'Invalid image'}
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Brightness
        brightness = np.mean(gray) / 255.0
        
        # Sharpness (Laplacian variance)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = laplacian.var() / 1000.0  # Normalize
        
        # Contrast
        contrast = gray.std() / 128.0
        
        # Overall quality score
        quality_score = (brightness * 0.3 + sharpness * 0.5 + contrast * 0.2)
        
        return {
            'success': True,
            'brightness': float(brightness),
            'sharpness': float(sharpness),
            'contrast': float(contrast),
            'quality_score': float(min(quality_score, 1.0))
        }


class FaceEmbeddingService:
    """
    Generate face embeddings using multiple AI models.
    """
    
    def __init__(self):
        self.insightface_model = None
        self.deepface_models = {}
        self.dlib_model = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize embedding models."""
        try:
            import insightface
            self.insightface_model = insightface.app.FaceAnalysis()
            self.insightface_model.prepare(ctx_id=0, det_size=(640, 640))
            logger.info("InsightFace embedding model initialized")
        except Exception as e:
            logger.warning(f"InsightFace not available: {e}")
        
        try:
            from deepface import DeepFace
            # Pre-load models
            self.deepface_models['Facenet'] = True
            self.deepface_models['VGG-Face'] = True
            logger.info("DeepFace models initialized")
        except Exception as e:
            logger.warning(f"DeepFace not available: {e}")
        
        try:
            import dlib
            # Load dlib shape predictor and face recognition model
            # Note: These files need to be downloaded separately
            logger.info("dlib model initialized")
        except Exception as e:
            logger.warning(f"dlib not available: {e}")
    
    def generate_embeddings(self, image_data: bytes) -> Dict:
        """
        Generate face embeddings using all available models.
        
        Args:
            image_data: Raw image bytes
            
        Returns:
            Dict with embeddings from each model
        """
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {'success': False, 'error': 'Invalid image'}
        
        embeddings = {
            'success': True,
            'insightface': None,
            'deepface': None,
            'dlib': None
        }
        
        # InsightFace embedding
        if self.insightface_model is not None:
            try:
                rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                faces = self.insightface_model.get(rgb_img)
                if len(faces) > 0:
                    # Use the first face
                    embedding = faces[0].embedding
                    embeddings['insightface'] = embedding.tolist()
            except Exception as e:
                logger.error(f"InsightFace embedding error: {e}")
        
        # DeepFace embedding
        if self.deepface_models:
            try:
                from deepface import DeepFace
                # Save temp image
                import tempfile
                with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
                    tmp.write(image_data)
                    tmp_path = tmp.name
                
                embedding = DeepFace.represent(
                    img_path=tmp_path,
                    model_name='Facenet',
                    enforce_detection=False
                )
                embeddings['deepface'] = embedding[0]['embedding']
                
                import os
                os.unlink(tmp_path)
            except Exception as e:
                logger.error(f"DeepFace embedding error: {e}")
        
        return embeddings
    
    def compare_embeddings(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Compare two face embeddings.
        
        Args:
            embedding1: First embedding
            embedding2: Second embedding
            
        Returns:
            Similarity score (0-1)
        """
        if not embedding1 or not embedding2:
            return 0.0
        
        # Convert to numpy arrays
        emb1 = np.array(embedding1)
        emb2 = np.array(embedding2)
        
        # Cosine similarity
        similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
        
        # Normalize to 0-1 range
        return float((similarity + 1) / 2)


class FaceRecognitionEngine:
    """
    Main face recognition engine.
    Combines detection, embedding, and matching.
    """
    
    def __init__(self):
        self.detector = FaceDetectionService()
        self.embedder = FaceEmbeddingService()
    
    def enroll_face(self, image_data: bytes, angle: str) -> Dict:
        """
        Process and enroll a face image.
        
        Args:
            image_data: Raw image bytes
            angle: Face angle (center, up, down, etc.)
            
        Returns:
            Dict with enrollment result
        """
        # Detect faces
        detection_result = self.detector.detect_faces(image_data)
        
        if not detection_result['success']:
            return {
                'success': False,
                'error': 'No face detected',
                'detection_result': detection_result
            }
        
        if detection_result['faces_detected'] > 1:
            return {
                'success': False,
                'error': 'Multiple faces detected',
                'detection_result': detection_result
            }
        
        # Check image quality
        quality_result = self.detector.calculate_image_quality(image_data)
        
        if quality_result.get('quality_score', 0) < 0.4:
            return {
                'success': False,
                'error': 'Image quality too low',
                'quality_result': quality_result
            }
        
        # Generate embeddings
        embeddings = self.embedder.generate_embeddings(image_data)
        
        if not embeddings['success']:
            return {
                'success': False,
                'error': 'Failed to generate embeddings',
                'embeddings': embeddings
            }
        
        return {
            'success': True,
            'angle': angle,
            'detection_result': detection_result,
            'quality_result': quality_result,
            'embeddings': embeddings
        }
    
    def recognize_face(self, image_data: bytes, enrolled_embeddings: Dict) -> Dict:
        """
        Recognize a face against enrolled data.
        
        Args:
            image_data: Raw image bytes
            enrolled_embeddings: Dict of enrolled embeddings
            
        Returns:
            Dict with recognition result
        """
        # Detect faces
        detection_result = self.detector.detect_faces(image_data)
        
        if not detection_result['success']:
            return {
                'success': False,
                'recognized': False,
                'error': 'No face detected'
            }
        
        # Generate embeddings for input image
        input_embeddings = self.embedder.generate_embeddings(image_data)
        
        if not input_embeddings['success']:
            return {
                'success': False,
                'recognized': False,
                'error': 'Failed to generate embeddings'
            }
        
        # Compare with enrolled embeddings
        similarities = {}
        
        if input_embeddings['insightface'] and enrolled_embeddings.get('insightface'):
            similarities['insightface'] = self.embedder.compare_embeddings(
                input_embeddings['insightface'],
                enrolled_embeddings['insightface']
            )
        
        if input_embeddings['deepface'] and enrolled_embeddings.get('deepface'):
            similarities['deepface'] = self.embedder.compare_embeddings(
                input_embeddings['deepface'],
                enrolled_embeddings['deepface']
            )
        
        # Calculate weighted average
        from apps.face_recognition.models import FaceRecognitionSettings
        settings = FaceRecognitionSettings.get_settings()
        
        total_score = 0
        total_weight = 0
        
        if 'insightface' in similarities:
            total_score += similarities['insightface'] * settings.insightface_weight
            total_weight += settings.insightface_weight
        
        if 'deepface' in similarities:
            total_score += similarities['deepface'] * settings.deepface_weight
            total_weight += settings.deepface_weight
        
        confidence = total_score / total_weight if total_weight > 0 else 0
        
        recognized = confidence >= settings.min_confidence_threshold
        
        return {
            'success': True,
            'recognized': recognized,
            'confidence': float(confidence),
            'similarities': similarities,
            'threshold': settings.min_confidence_threshold
        }
