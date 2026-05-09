import pickle
import os
import pandas as pd

class Predictor:
    # Feature names must match the training data columns
    FEATURE_NAMES = ["entropy", "write_freq", "file_size_change", "extension_change"]
    
    def __init__(self, model_path="model.pkl"):
        self.model_path = os.path.join(os.path.dirname(__file__), model_path)
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            with open(self.model_path, "rb") as f:
                self.model = pickle.load(f)
            print("ML Model loaded successfully.")
        except FileNotFoundError:
            print(f"Model file not found at {self.model_path}. Please train the model first.")
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict(self, entropy, write_freq, file_size_change, extension_change):
        """
        Predicts if the behavior is ransomware.
        Returns: (is_ransomware (bool), probability (float))
        """
        if not self.model:
            return False, 0.0
        
        # Use DataFrame with column names to match training data format
        features = pd.DataFrame(
            [[entropy, write_freq, file_size_change, extension_change]],
            columns=self.FEATURE_NAMES
        )
        
        try:
            prediction = self.model.predict(features)[0]
            probability = self.model.predict_proba(features)[0][1]
            return bool(prediction), float(probability)
        except Exception as e:
            print(f"Prediction error: {e}")
            return False, 0.0
