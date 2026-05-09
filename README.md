# SentinelGuard

**AI-Driven Ransomware Early Detection & Auto-Recovery Framework**

> *"Detect. Defend. Recover — Before Damage Happens."*

## 🎯 Overview

SentinelGuard is a production-ready cybersecurity application that monitors file systems in real-time, uses AI/ML to detect ransomware behavior, and automatically blocks malicious processes while restoring affected files. Built with Next.js, FastAPI, and Python.

## ✨ Features

- **Real-time File Monitoring** - Watches configured directories for suspicious activity
- **AI/ML Detection** - Analyzes entropy, write bursts, and file behavioral patterns
- **Automated Defense** - Kills malicious processes and quarantines affected files
- **Professional Dashboard** - Real-time threat visualization with charts and metrics
- **Safe Simulation** - Demo ransomware behavior without actual harm
- **Event Logging** - Complete audit trail of all file system activity

## 🏗️ Architecture

```
SentinelGuard/
├── backend/          # FastAPI REST API
├── frontend/         # Next.js 14 Dashboard
├── sentinel_agent/   # File monitoring service
├── ml_engine/        # ML model (future)
├── simulation/       # Safe ransomware simulator
└── docs/            # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Windows/Linux/macOS

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

Backend will run on `http://localhost:8000`

### 2. Sentinel Agent Setup

```bash
cd sentinel_agent
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python agent.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📖 Usage

1. **Configure Monitored Paths**
   - Navigate to Settings page
   - Add directories to monitor (e.g., `C:\Users\YourName\Documents`)

2. **Start Protection**
   - Backend and Agent must be running
   - Dashboard shows real-time system status

3. **Test Detection**
   - Go to Simulation page
   - Click "Run Simulation"
   - Watch Dashboard and Logs for threat detection

4. **Monitor Activity**
   - **Dashboard**: Overall system health and threat level
   - **Threats**: Detailed alert analysis
   - **Logs**: Real-time file activity stream
   - **Settings**: Path management and thresholds

## 🔧 Configuration

### Agent Settings (`sentinel_agent/config.py`)

```python
ENTROPY_THRESHOLD = 7.5  # Higher = more sensitive
WRITE_BURST_THRESHOLD = 10  # files per second
```

### Backend API (`backend/app/core/config.py`)

```python
DATABASE_URL =  "sqlite+aiosqlite:///./sentinelguard.db"
BACKEND_CORS_ORIGINS = ["http://localhost:3000"]
```

## 🛡️ How It Works

1. **Monitor** - Watchdog tracks all file events in configured paths
2. **Analyze** - Calculate entropy, detect write bursts, check extension changes
3. **Predict** - Behavioral analysis determines if activity is malicious
4. **Defend** - Automatically kill suspicious processes
5. **Quarantine** - Move affected files to safe location
6. **Alert** - Send notifications to dashboard in real-time

## 📊 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Axios

### Backend
- FastAPI
- SQLAlchemy (Async)
- SQLite
- Pydantic

### Agent
- Watchdog
- Psutil
- NumPy
- Scikit-learn (future ML)

## 🔒 Security Notes

- This is a **proof-of-concept** educational project
- The simulation uses safe Base64 encoding, NOT real malware
- Process termination requires appropriate system permissions
- Always test in a safe environment first

## 📝 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

- `GET /api/v1/events/` - Fetch file events
- `POST /api/v1/events/` - Log new event
- `GET /api/v1/alerts/` - Get security alerts
- `GET /api/v1/settings/paths` - List monitored paths
- `POST /api/v1/settings/paths` - Add monitored path

## 🎓 Educational Purpose

This project demonstrates:
- Real-time file system monitoring
- Behavioral analysis techniques
- Threat detection heuristics
- Full-stack application development
- Modern web technologies (Next.js 14, FastAPI)

## 📄 License

MIT License - Educational use only

## 👨‍💻 Author

Built for IS Project - Semester 7

---

**⚠️ DISCLAIMER**: This tool is for educational and research purposes only. The simulation functionality is completely safe and does not use real malware. Always ensure you have proper authorization before monitoring any file systems.
