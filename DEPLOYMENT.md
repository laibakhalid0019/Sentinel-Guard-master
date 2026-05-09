# SentinelGuard - Deployment Guide

## 📦 Local Development Setup

### System Requirements

- **Operating System**: Windows 10/11, Linux, or macOS
- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **RAM**: 4GB minimum
- **Disk Space**: 1GB free space

### Step 1: Clone/Download the Project

```bash
cd f:\F\SEM-7\IS\Project\SentinelGuard
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\activate
# Windows CMD:
.\venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python run.py
```

**Backend will be available at**: `http://localhost:8000`

### Step 3: Sentinel Agent Setup

Open a **new terminal window**:

```bash
cd sentinel_agent

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run agent
python agent.py
```

**Agent will start monitoring** the configured paths in `sentinel_agent/config.py`

### Step 4: Frontend Setup

Open a **third terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

**Frontend will be available at**: `http://localhost:3000`

## 🎮 Running the Complete System

You need 3 terminal windows open simultaneously:

1. **Terminal 1 (Backend)**:
   ```bash
   cd backend
   .\venv\Scripts\activate
   python run.py
   ```

2. **Terminal 2 (Agent)**:
   ```bash
   cd sentinel_agent
   .\venv\Scripts\activate
   python agent.py
   ```

3. **Terminal 3 (Frontend)**:
   ```bash
   cd frontend
   npm run dev
   ```

## 🧪 Testing the System

### 1. Access the Dashboard
- Open browser: `http://localhost:3000`
- You should see the SentinelGuard dashboard

### 2. Configure Monitored Path
- Navigate to **Settings** page
- Add a test path: `C:\Users\YourName\Documents\TestMonitor`
- The agent will automatically create this directory

### 3. Run Simulation

**Option A: Via UI**
- Go to **Simulation** page
- Click "Run Simulation"
- This is a visual trigger (you still need to run the script manually)

**Option B: Via Command Line** (Recommended)
Open a **fourth terminal**:

```bash
cd simulation
python ransomware_sim.py
```

### 4. Observe Detection
- **Dashboard**: Watch threat level increase
- **Logs**: See file events in real-time
- **Threats**: View generated alerts
- **Agent Terminal**: See detection messages

### Expected Behavior
1. Simulation creates 20 dummy files
2. Simulation encrypts them rapidly
3. Agent detects high entropy + write burst
4. Agent kills the simulation process
5. Affected files are quarantined
6. Dashboard shows threat detection

## 🐛 Troubleshooting

### Backend won't start
- **Error**: `ModuleNotFoundError`
  - **Solution**: Ensure virtual environment is activated and dependencies are installed
  ```bash
  .\venv\Scripts\activate
  pip install -r requirements.txt
  ```

### Frontend shows "Cannot connect to API"
- **Check**: Is backend running on port 8000?
  - Open `http://localhost:8000/` in browser
  - You should see: `{"message": "SentinelGuard Backend is Running"}`
- **Fix**: Start backend server

### Agent not detecting events
- **Check**: Is the backendrunning?
- **Check**: Are you monitoring the correct path?
- **Check**: Did you create files in the monitored directory?
- **Fix**: Verify `sentinel_agent/config.py` has correct paths

## 📊 Database

SentinelGuard uses SQLite by default:
- **Location**: `backend/sentinelguard.db`
- **Auto-created** on first run
- **Schema**: Events, Alerts, MonitoredPaths, SystemLogs

To reset the database:
```bash
cd backend
rm sentinelguard.db
python run.py  # Will recreate tables
```

## 🚀 Production Deployment

### Backend (FastAPI)

**Option 1: Uvicorn (Basic)**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Option 2: Gunicorn (Production)**
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Option 3: Docker**
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (Next.js)

**Build for production**:
```bash
cd frontend
npm run build
npm run start
```

**Deploy to Vercel** (Recommended):
```bash
npm install -g vercel
vercel deploy
```

**Environment Variables** (`.env.local`):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
```

### Agent (Background Service)

**Windows (NSSM)**:
1. Download NSSM: https://nssm.cc/download
2. Install as service:
```bash
nssm install SentinelAgent "C:\Path\To\venv\Scripts\python.exe" "C:\Path\To\sentinel_agent\agent.py"
nssm start SentinelAgent
```

**Linux (systemd)**:
Create `/etc/systemd/system/sentinel-agent.service`:
```ini
[Unit]
Description=SentinelGuard Agent
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/sentinel_agent
ExecStart=/path/to/venv/bin/python agent.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable sentinel-agent
sudo systemctl start sentinel-agent
```

## 🔐 Security Considerations

### For Production:
1. **Change CORS origins** - Update `backend/app/core/config.py`
2. **Use PostgreSQL** - Replace SQLite for better concurrency
3. **Add authentication** - Implement JWT/OAuth
4. **HTTPS only** - Use SSL certificates
5. **Rate limiting** - Add request throttling
6. **Input validation** - Sanitize all user inputs

### Environment Variables:
```bash
# Backend .env
DATABASE_URL=postgresql://user:pass@localhost/sentinelguard
SECRET_KEY=your-secret-key-here
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]

# Frontend .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

## 📈 Monitoring & Logs

### Backend Logs
```bash
cd backend
python run.py 2>&1 | tee backend.log
```

### Agent Logs
```bash
cd sentinel_agent
python agent.py 2>&1 | tee agent.log
```

## 🎯 Performance Optimization

- **Backend**: Use async operations, connection pooling
- **Frontend**: Enable Next.js caching, optimize images
- **Agent**: Adjust polling intervals, batch database writes
- **Database**: Add indexes on timestamp and is_suspicious columns

## 📞 Support

For issues:
1. Check the Troubleshooting section
2. View logs in terminal
3. Inspect browser console (F12)
4. Check API status at `http://localhost:8000/health`

---

**Happy Securing! 🛡️**
