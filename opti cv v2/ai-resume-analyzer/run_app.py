import subprocess
import time
import sys
import os

def start_services():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("=" * 60)
    print("🚀 STARTING AI RESUME ANALYZER (OPTI.CV v2.0)")
    print("=" * 60)

    print("\n[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=backend_dir
    )

    time.sleep(2)

    print("\n[2/2] Launching Next.js Frontend on http://localhost:3000 ...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir
    )

    print("\n" + "=" * 60)
    print("✨ ALL SERVICES RUNNING!")
    print("   👉 Open your browser at: http://localhost:3000")
    print("   👉 Backend API Docs at:   http://127.0.0.1:8000/docs")
    print("=" * 60)
    print("\nPress Ctrl+C to stop all services.\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Shutdown complete.")

if __name__ == "__main__":
    start_services()
