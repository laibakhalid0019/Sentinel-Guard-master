import os
import time
import random
import string
import sys

# Get the directory where this script is located (simulation folder)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SANDBOX_DIR = os.path.join(SCRIPT_DIR, "sandbox_test")
NUM_FILES = 20
FILE_SIZE_KB = 10

def create_sandbox():
    if not os.path.exists(SANDBOX_DIR):
        os.makedirs(SANDBOX_DIR)
    
    print(f"Creating {NUM_FILES} dummy files in {SANDBOX_DIR}...")
    for i in range(NUM_FILES):
        file_path = os.path.join(SANDBOX_DIR, f"doc_{i}.txt")
        with open(file_path, "w") as f:
            f.write("This is a safe dummy file for testing SentinelGuard.\n" * 100)

def simulate_ransomware():
    print("\n[!!!] STARTING RANSOMWARE SIMULATION [!!!]")
    print("This is a SAFE simulation. Only files in 'sandbox_test' will be affected.")
    time.sleep(2)
    
    files = [f for f in os.listdir(SANDBOX_DIR) if f.endswith(".txt")]
    
    if not files:
        print("No files found to encrypt. Run creation first.")
        return

    for filename in files:
        file_path = os.path.join(SANDBOX_DIR, filename)
        
        # 1. Read Content
        with open(file_path, "r") as f:
            content = f.read()
            
        # 2. "Encrypt" (XOR with key) - Reversible and safe
        encrypted_content = "".join([chr(ord(c) ^ 0x55) for c in content])
        
        # 3. Write Back (Rapidly)
        print(f"Encrypting {filename}...")
        with open(file_path, "w") as f:
            f.write(encrypted_content)
            
        # 4. Rename Extension
        new_path = file_path + ".encrypted"
        # Remove if already exists
        if os.path.exists(new_path):
            os.remove(new_path)
        os.rename(file_path, new_path)
        
        # Sleep briefly to simulate rapid but sequential attack
        time.sleep(0.1)
        
    print("\n[!!!] SIMULATION COMPLETE. All files encrypted.")

if __name__ == "__main__":
    create_sandbox()
    # Auto-run if called from API, otherwise wait for input
    if "--auto" in sys.argv:
        print("Auto-running simulation...")
        simulate_ransomware()
    else:
        input("Press Enter to start the attack...")
        simulate_ransomware()
