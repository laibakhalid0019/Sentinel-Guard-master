# SentinelGuard - Quick Start Script
# This script helps you start all components in one command

# Check if Python is installed
Write-Host "==================== SentinelGuard Setup ====================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (-not (Test-Command python)) {
    Write-Host "❌ Python not found. Please install Python 3.10+" -ForegroundColor Red
    exit 1
}
if (-not (Test-Command node)) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python found: $(python --version)" -ForegroundColor Green
Write-Host "✅ Node.js found: $(node --version)" -ForegroundColor Green
Write-Host ""

# Setup Backend
Write-Host "Setting up Backend..." -ForegroundColor Yellow
if (-not (Test-Path "backend\venv")) {
    Write-Host "Creating virtual environment for backend..."
    Set-Location backend
    python -m venv venv
    .\venv\Scripts\pip install -r requirements.txt
    Set-Location  ..
}
Write-Host "✅ Backend ready" -ForegroundColor Green

# Setup Agent
Write-Host "Setting up Sentinel Agent..." -ForegroundColor Yellow
if (-not (Test-Path "sentinel_agent\venv")) {
    Write-Host "Creating virtual environment for agent..."
    Set-Location sentinel_agent
    python -m venv venv
    .\venv\Scripts\pip install -r requirements.txt
    Set-Location ..
}
Write-Host "✅ Agent ready" -ForegroundColor Green

# Setup Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..."
    Set-Location frontend
    npm install
    Set-Location ..
}
Write-Host "✅ Frontend ready" -ForegroundColor Green

Write-Host ""
Write-Host "==================== Starting Services ====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening 3 terminals to run services..." -ForegroundColor Yellow
Write-Host ""

# Start Backend
Write-Host "Starting Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\activate; python run.py"

Start-Sleep -Seconds 2

# Start Agent
Write-Host "Starting Sentinel Agent..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\sentinel_agent'; .\venv\Scripts\activate; python agent.py"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "✅ SentinelGuard is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📖 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 10-15 seconds for all services to start, then open:" -ForegroundColor Yellow
Write-Host "http://localhost:3000" -ForegroundColor White -BackgroundColor Blue
Write-Host ""
Write-Host "Press any key to exit this window (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
