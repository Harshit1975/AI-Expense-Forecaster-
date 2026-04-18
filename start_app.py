import subprocess
import sys
import time
import os

def main():
    print("=========================================")
    print("Starting Expense Tracker Single Server App")
    print("=========================================")
    
    # Path setup
    root_path = os.path.dirname(os.path.abspath(__file__))
    backend_path = os.path.join(root_path, "backend")
    frontend_path = os.path.join(root_path, "frontend")
    frontend_dist_path = os.path.join(frontend_path, "dist")

    # Check if frontend is built
    if not os.path.exists(frontend_dist_path):
        print("-> Frontend 'dist' folder not found. Building React app...")
        subprocess.run(["npm", "run", "build"], cwd=frontend_path, shell=(sys.platform == "win32"))

    # Start Backend
    print("-> Starting Python FastAPI Unified Server...")
    # Using python -m uvicorn to ensure it uses the current environment
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app:app", "--reload"], 
        cwd=backend_path
    )

    print("\nServer is starting!")
    print("The Dashboard is available at: http://127.0.0.1:8000")
    print("Press CTRL+C at any time to shut everything down.\n")

    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down server...")
        backend_process.terminate()
        print("Goodbye!")

if __name__ == "__main__":
    main()
