import pandas as pd
import numpy as np
import random

def generate_synthetic_data(num_samples=5000):
    """
    Generates a synthetic dataset for ransomware detection.
    Features:
    - entropy: Shannon entropy of the file (0-8)
    - write_freq: Number of write operations per second
    - file_size_change: Ratio of new size to old size
    - extension_change: 1 if extension changed, 0 otherwise
    - is_ransomware: Target label (1 = Ransomware, 0 = Benign)
    """
    
    data = []
    
    for _ in range(num_samples):
        is_ransomware = random.choice([0, 1])
        
        if is_ransomware:
            # Ransomware behavior simulation
            entropy = np.random.normal(7.5, 0.5) # High entropy (encrypted)
            entropy = min(8.0, max(0.0, entropy))
            
            write_freq = np.random.normal(50, 15) # Rapid writes
            write_freq = max(0, write_freq)
            
            file_size_change = np.random.normal(1.0, 0.1) # Often similar size or slightly different
            
            extension_change = random.choices([0, 1], weights=[0.2, 0.8])[0] # Likely to change extension
            
        else:
            # Benign behavior simulation
            entropy = np.random.normal(4.0, 1.5) # Varied entropy
            entropy = min(8.0, max(0.0, entropy))
            
            write_freq = np.random.normal(5, 2) # Normal write speed
            write_freq = max(0, write_freq)
            
            file_size_change = np.random.normal(1.1, 0.3) # Normal growth
            
            extension_change = random.choices([0, 1], weights=[0.95, 0.05])[0] # Unlikely to change extension
            
        data.append({
            "entropy": entropy,
            "write_freq": write_freq,
            "file_size_change": file_size_change,
            "extension_change": extension_change,
            "is_ransomware": is_ransomware
        })
        
    df = pd.DataFrame(data)
    df.to_csv("ransomware_dataset.csv", index=False)
    print(f"Generated {num_samples} samples in ransomware_dataset.csv")

if __name__ == "__main__":
    generate_synthetic_data()
