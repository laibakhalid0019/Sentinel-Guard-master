import time
import logging
from monitor import SentinelMonitor

if __name__ == "__main__":
    print("SentinelGuard Agent Starting...")
    monitor = SentinelMonitor()
    monitor.start()
