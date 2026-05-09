import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import os

def train_model():
    if not os.path.exists("ransomware_dataset.csv"):
        print("Dataset not found. Please run generate_dataset.py first.")
        return

    df = pd.read_csv("ransomware_dataset.csv")
    
    X = df.drop("is_ransomware", axis=1)
    y = df["is_ransomware"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    print("Model Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)
    
    print("Model saved to model.pkl")

if __name__ == "__main__":
    train_model()
