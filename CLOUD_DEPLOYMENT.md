# ☁️ SentinelGuard Cloud Deployment Guide

## 📋 Overview

| Component | Recommended Platform | Alternative | Cost |
|-----------|---------------------|-------------|------|
| **Frontend** | Vercel | Netlify, Cloudflare Pages | Free tier available |
| **Backend** | Railway | Render, Fly.io, AWS | Free tier available |
| **Agent** | Local only | Cannot be deployed to cloud | N/A |
| **Database** | Railway PostgreSQL | Supabase, PlanetScale | Free tier available |

> ⚠️ **Important**: The Sentinel Agent MUST run locally on the machine you want to protect. It cannot be deployed to the cloud because it needs direct access to the file system.

---

## 1️⃣ Deploy Frontend to Vercel

### Step 1: Push Code to GitHub

```bash
# In your project root
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SentinelGuard.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"Add New Project"**
3. Import your `SentinelGuard` repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api/v1` | Update after deploying backend |

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

Your frontend will be available at: `https://your-project.vercel.app`

---

## 2️⃣ Deploy Backend to Railway

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your `SentinelGuard` repository

### Step 3: Configure the Service

1. Click on the deployed service
2. Go to **Settings** tab
3. Set **Root Directory**: `backend`
4. Set **Start Command**: 
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Step 4: Set Environment Variables

Go to **Variables** tab and add:

```
DATABASE_URL=sqlite+aiosqlite:///./sentinelguard.db
BACKEND_CORS_ORIGINS=["https://your-frontend.vercel.app","http://localhost:3000"]
SECRET_KEY=generate-a-random-32-character-string-here
```

### Step 5: Add PostgreSQL (Optional but Recommended)

1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Copy the `DATABASE_URL` from the PostgreSQL service
4. Update the `DATABASE_URL` environment variable

### Step 6: Generate Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy your backend URL (e.g., `sentinelguard-backend.railway.app`)

### Step 7: Update Frontend

Go back to Vercel and update:
```
NEXT_PUBLIC_API_URL=https://sentinelguard-backend.railway.app/api/v1
```

---

## 3️⃣ Alternative: Deploy Backend to Render

### Step 1: Create Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `sentinelguard-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Environment Variables

Add the same variables as Railway.

---

## 4️⃣ Alternative: Deploy Backend to Fly.io

### Step 1: Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS/Linux
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login

```bash
fly auth login
```

### Step 3: Create fly.toml

Create `backend/fly.toml`:

```toml
app = "sentinelguard-backend"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8000"

[http_service]
  internal_port = 8000
  force_https = true

[[http_service.checks]]
  path = "/health"
  interval = "30s"
  timeout = "5s"
```

### Step 4: Deploy

```bash
cd backend
fly launch
fly deploy
```

---

## 5️⃣ Setup Local Agent (Required)

The Sentinel Agent **MUST** run on the computer you want to protect.

### Configure Agent to Use Cloud Backend

Edit `sentinel_agent/config.py`:

```python
class Config:
    # Change this to your deployed backend URL
    BACKEND_URL = "https://your-backend.railway.app/api/v1"
    
    # Local paths to monitor
    MONITORED_PATHS = [
        r"C:\Users\YourName\Documents",
        r"C:\Users\YourName\Desktop"
    ]
    
    # Detection thresholds
    ENTROPY_THRESHOLD = 7.5
    WRITE_BURST_THRESHOLD = 10
    
    # Quarantine directory
    QUARANTINE_DIR = r"C:\SentinelGuard\Quarantine"
```

### Run Agent as Background Service (Windows)

**Option A: Task Scheduler**

1. Open Task Scheduler
2. Create Basic Task → Name: "SentinelGuard Agent"
3. Trigger: "When the computer starts"
4. Action: "Start a program"
   - Program: `C:\Path\To\sentinel_agent\venv\Scripts\python.exe`
   - Arguments: `agent.py`
   - Start in: `C:\Path\To\sentinel_agent`
5. Enable "Run with highest privileges"

**Option B: NSSM (Non-Sucking Service Manager)**

```powershell
# Download NSSM from https://nssm.cc/download
# Extract and run:
nssm install SentinelAgent "C:\Path\To\venv\Scripts\python.exe" "C:\Path\To\sentinel_agent\agent.py"
nssm set SentinelAgent AppDirectory "C:\Path\To\sentinel_agent"
nssm start SentinelAgent
```

---

## 📊 Complete Architecture After Deployment

```
┌────────────────────────────────────────────────────────────────────┐
│                         INTERNET                                    │
│                                                                     │
│  ┌──────────────────┐              ┌──────────────────────────┐    │
│  │  VERCEL          │    HTTPS     │  RAILWAY / RENDER        │    │
│  │  (Frontend)      │◄────────────►│  (Backend API)           │    │
│  │                  │              │                          │    │
│  │  your-app.       │              │  your-backend.           │    │
│  │  vercel.app      │              │  railway.app             │    │
│  └──────────────────┘              └──────────────────────────┘    │
│         ▲                                    ▲                      │
│         │ Browser                            │ HTTPS API            │
│         │                                    │                      │
└─────────┼────────────────────────────────────┼──────────────────────┘
          │                                    │
          │                                    │
┌─────────┼────────────────────────────────────┼──────────────────────┐
│         ▼                                    ▼                      │
│  ┌──────────────────┐              ┌──────────────────────────┐    │
│  │  YOUR BROWSER    │              │  SENTINEL AGENT          │    │
│  │  (View Dashboard)│              │  (File Monitoring)       │    │
│  │                  │              │  Running on YOUR PC      │    │
│  └──────────────────┘              └──────────────────────────┘    │
│                                              │                      │
│                         YOUR LOCAL COMPUTER  │ Monitors             │
│                                              ▼                      │
│                                    ┌──────────────────────────┐    │
│                                    │  YOUR FILES              │    │
│                                    │  C:\Users\...\Documents  │    │
│                                    └──────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Quick Deployment Commands

### Frontend (Vercel CLI)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel login
vercel --prod
```

### Backend (Railway CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway login
railway init
railway up
```

---

## 🔐 Security Checklist for Production

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Update `BACKEND_CORS_ORIGINS` to only allow your frontend domain
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Consider adding authentication to the API
- [ ] Use PostgreSQL instead of SQLite for production
- [ ] Set up rate limiting on the backend
- [ ] Enable logging and monitoring

---

## 🆘 Troubleshooting

### Frontend can't connect to backend

1. Check `NEXT_PUBLIC_API_URL` is correct in Vercel
2. Verify backend is running: visit `https://your-backend.railway.app/health`
3. Check CORS settings include your frontend domain

### Agent can't connect to cloud backend

1. Verify `BACKEND_URL` in agent config
2. Check your firewall allows outbound HTTPS
3. Test connectivity: `curl https://your-backend.railway.app/health`

### Database errors on Railway

1. Check `DATABASE_URL` format
2. For PostgreSQL: `postgresql://user:pass@host:5432/db`
3. For SQLite: `sqlite+aiosqlite:///./sentinelguard.db`

---

## 💰 Cost Estimation (Free Tiers)

| Service | Free Tier Limits |
|---------|-----------------|
| **Vercel** | 100GB bandwidth/month, Unlimited deploys |
| **Railway** | $5 credit/month, Shared CPU |
| **Render** | 750 hours/month, Sleeps after 15min inactivity |
| **Fly.io** | 3 shared VMs, 3GB storage |

For a personal/demo project, free tiers should be sufficient!

---

**Happy Deploying! 🚀**

