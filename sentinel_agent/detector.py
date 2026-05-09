import os
import math
import time
import logging
import requests
from collections import deque
from config import config
from actions import trigger_defense
import sys

# Add project root to path to import ml_engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml_engine.predictor import Predictor

logger = logging.getLogger(__name__)

# Initialize Predictor
try:
    predictor = Predictor(model_path="../ml_engine/model.pkl")
except Exception as e:
    logger.error(f"Failed to initialize ML Predictor: {e}")
    predictor = None

# Track write events for burst detection
# Key: directory_path, Value: deque of timestamps
write_history = {}

def calculate_entropy(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = f.read()
        if not data:
            return 0
        entropy = 0
        for x in range(256):
            p_x = float(data.count(bytes([x]))) / len(data)
            if p_x > 0:
                entropy += - p_x * math.log(p_x, 2)
        return entropy
    except Exception as e:
        # logger.error(f"Error calculating entropy for {file_path}: {e}")
        return 0

def analyze_file_event(file_path, event_type):
    # 1. Check Entropy
    entropy = calculate_entropy(file_path)
    
    # 2. Check Write Burst
    directory = os.path.dirname(file_path)
    now = time.time()
    
    if directory not in write_history:
        write_history[directory] = deque()
    
    # Remove events older than 1 second
    while write_history[directory] and write_history[directory][0] < now - 1:
        write_history[directory].popleft()
    
    write_history[directory].append(now)
    burst_count = len(write_history[directory])
    
    is_suspicious = False
    reasons = []
    
    # ML Prediction
    ml_prob = 0.0
    if predictor:
        # Heuristic features for now, ideally we track file size change and extension change
        # For real-time, we might not have 'old' file size easily without a DB or cache
        # We assume file_size_change=1.0 and extension_change=0 for simple events unless detected otherwise
        
        # Simple heuristic for extension change (not perfect but works for single event)
        # In a real system, we'd compare with previous state
        extension_change = 0 
        file_size_change = 1.0 
        
        is_ransomware, ml_prob = predictor.predict(entropy, burst_count, file_size_change, extension_change)
        
        if is_ransomware:
            is_suspicious = True
            reasons.append(f"ML Detection (Prob: {ml_prob:.2f})")

    # Heuristic Checks (Fallback/Augmentation)
    if entropy > config.ENTROPY_THRESHOLD:
        is_suspicious = True
        reasons.append(f"High Entropy: {entropy:.2f}")
    
    if burst_count > config.WRITE_BURST_THRESHOLD:
        is_suspicious = True
        reasons.append(f"Write Burst: {burst_count} files/sec")
        
    # Report to Backend
    event_data = {
        "file_path": file_path,
        "event_type": event_type,
        "is_suspicious": is_suspicious,
        "details": {
            "entropy": entropy,
            "burst_count": burst_count,
            "ml_probability": ml_prob,
            "reasons": reasons
        }
    }
    
    try:
        requests.post(f"{config.BACKEND_URL}/events/", json=event_data)
    except Exception as e:
        logger.error(f"Failed to send event to backend: {e}")

    if is_suspicious:
        logger.warning(f"THREAT DETECTED: {file_path} | Reasons: {reasons}")
        trigger_defense(file_path, reasons)
