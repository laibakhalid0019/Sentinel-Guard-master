import time
import logging
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from detector import analyze_file_event
from config import config

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class RansomwareHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return
        self.process_event(event, "modified")

    def on_created(self, event):
        if event.is_directory:
            return
        self.process_event(event, "created")

    def on_moved(self, event):
        if event.is_directory:
            return
        self.process_event(event, "moved")

    def process_event(self, event, event_type):
        # logger.info(f"Event: {event_type} - {event.src_path}")
        analyze_file_event(event.src_path, event_type)

class SentinelMonitor:
    def __init__(self):
        self.observer = Observer()
        self.handler = RansomwareHandler()

    def start(self):
        for path in config.MONITORED_PATHS:
            # Create the directory if it doesn't exist
            if not os.path.exists(path):
                logger.info(f"Creating monitored directory: {path}")
                os.makedirs(path, exist_ok=True)
            
            logger.info(f"Monitoring started on: {path}")
            self.observer.schedule(self.handler, path, recursive=True)
        
        self.observer.start()
        logger.info("✅ Sentinel Agent is RUNNING. Press Ctrl+C to stop.")
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop()

    def stop(self):
        logger.info("Stopping Sentinel Agent...")
        self.observer.stop()
        self.observer.join()

if __name__ == "__main__":
    monitor = SentinelMonitor()
    monitor.start()
