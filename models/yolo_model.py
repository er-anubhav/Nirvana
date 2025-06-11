import os
import traceback
import numpy as np
from config import logger

yolo_model = None

def load_yolo_model():
    global yolo_model
    try:
        from ultralytics import YOLO
        if os.path.exists('best.pt'):
            yolo_model = YOLO('best.pt')
            logger.info("YOLO model loaded successfully")
            return True
        else:
            logger.warning("YOLO model file 'best.pt' not found. Image categorization will be limited.")
            return False
    except ImportError:
        logger.warning("ultralytics not installed. Install with: pip install ultralytics. Image categorization will be limited.")
        return False
    except Exception as e:
        logger.error(f"Failed to load YOLO model: {e}")
        return False

def categorize_image_with_yolo(image_path):
    try:
        if yolo_model is None:
            logger.error("YOLO model not loaded")
            return None

        if not os.path.exists(image_path):
            logger.error(f"Image file not found: {image_path}")
            return None

        logger.info(f"Running YOLO prediction on: {image_path}")

        results = yolo_model.predict(image_path, verbose=False)

        if not results or len(results) == 0:
            logger.error("No results from YOLO prediction")
            return None

        result = results[0]

        if hasattr(result, 'probs') and result.probs is not None:
            name_dict = yolo_model.names
            prob_data = result.probs.data.tolist()

            if not prob_data:
                logger.error("No probability data from YOLO")
                return None

            max_idx = np.argmax(prob_data)
            predicted_class = name_dict.get(max_idx, f"Class_{max_idx}") # type: ignore
            max_confidence = max(prob_data)

            logger.info(f"Classification result: {predicted_class} with confidence: {max_confidence:.3f}")

            if max_confidence > 0.1: # type: ignore
                return f"{predicted_class} (confidence: {max_confidence:.1%})"
            else:
                return "Unable to classify with sufficient confidence"

        elif hasattr(result, 'boxes') and result.boxes is not None and len(result.boxes) > 0:
            boxes = result.boxes
            name_dict = yolo_model.names

            detections = []
            for box in boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = name_dict.get(class_id, f"Class_{class_id}")

                if confidence > 0.3:
                    detections.append(f"{class_name} ({confidence:.1%})")

            if detections:
                if len(detections) == 1:
                    return f"Detected: {detections[0]}"
                else:
                    return f"Detected: {', '.join(detections[:3])}"
            else:
                return "No objects detected with sufficient confidence"
        else:
            logger.error("Unexpected YOLO result format")
            return "Unable to process image with current model"

    except Exception as e:
        logger.error(f"Error in categorize_image_with_yolo: {e}")
        logger.error(traceback.format_exc())
        return None

model_loaded = load_yolo_model()
