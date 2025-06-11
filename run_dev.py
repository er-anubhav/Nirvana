import subprocess
import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')
logger = logging.getLogger(__name__)

# Directories to watch for changes
WATCH_DIRECTORIES = [
    './templates',
    './static',
    './routes',
    './models',
    './services'
]

# File extensions to monitor
WATCH_EXTENSIONS = ['.html', '.py', '.js', '.css']

class ChangeHandler(FileSystemEventHandler):
    def __init__(self, app_process):
        self.app_process = app_process
        self.last_restart_time = time.time()
        # Minimum time between restarts (seconds)
        self.restart_delay = 2  
        self.pending_restart = False
        
    def restart_app(self):
        """Restart the Flask application"""
        if time.time() - self.last_restart_time < self.restart_delay:
            # If we recently restarted, set a flag to restart after delay
            if not self.pending_restart:
                self.pending_restart = True
                logger.info("Change detected, scheduling restart...")
                time.sleep(self.restart_delay)
                self.pending_restart = False
                self.restart_app()
            return
            
        logger.info("Restarting Flask application...")
        
        # Terminate existing process
        if self.app_process and self.app_process.poll() is None:
            self.app_process.terminate()
            self.app_process.wait()
            
        # Start new process
        self.app_process = subprocess.Popen([sys.executable, 'app.py'])
        self.last_restart_time = time.time()
        logger.info("Flask application restarted successfully")

    def on_modified(self, event):
        # Check if the modified file has a watched extension
        if any(event.src_path.endswith(ext) for ext in WATCH_EXTENSIONS):
            logger.info(f"File changed: {event.src_path}")
            self.restart_app()
            
    def on_created(self, event):
        # Check if the created file has a watched extension
        if any(event.src_path.endswith(ext) for ext in WATCH_EXTENSIONS):
            logger.info(f"File created: {event.src_path}")
            self.restart_app()

def start_app_with_reloader():
    """Start the Flask application and monitor for changes"""
    logger.info("Starting Flask development server with auto-reload...")
    
    # Start the Flask application
    app_process = subprocess.Popen([sys.executable, 'app.py'])
    
    # Set up the file watcher
    observer = Observer()
    handler = ChangeHandler(app_process)
    
    # Watch all specified directories
    for directory in WATCH_DIRECTORIES:
        observer.schedule(handler, directory, recursive=True)
    
    # Start the observer
    observer.start()
    logger.info(f"Watching directories: {', '.join(WATCH_DIRECTORIES)}")
    logger.info(f"Watching file extensions: {', '.join(WATCH_EXTENSIONS)}")
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        # Stop the observer and the Flask app when Ctrl+C is pressed
        observer.stop()
        if app_process and app_process.poll() is None:
            app_process.terminate()
    
    # Wait for the observer to finish
    observer.join()
    logger.info("Development server shutdown")

if __name__ == "__main__":
    start_app_with_reloader()
