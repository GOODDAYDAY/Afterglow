@echo off
chcp 65001 >nul
title Afterglow

echo ========================================
echo   Afterglow - Starting up...
echo ========================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.13+
    pause
    exit /b 1
)

:: Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node 22+
    pause
    exit /b 1
)

:: Install backend dependencies
echo [1/4] Installing backend dependencies...
cd /d "%~dp0backend"
pip install -r requirements.txt -q
if %errorlevel% neq 0 (
    echo [ERROR] Backend dependency install failed.
    pause
    exit /b 1
)

:: Install frontend dependencies
echo [2/4] Installing frontend dependencies...
cd /d "%~dp0frontend"
if not exist node_modules (
    npm install
) else (
    echo       node_modules exists, skipping.
)
if %errorlevel% neq 0 (
    echo [ERROR] Frontend dependency install failed.
    pause
    exit /b 1
)

:: Start backend in background (same console = guardian)
echo [3/4] Starting backend (port 8000)...
cd /d "%~dp0backend"
start /b python -m uvicorn app.main:app --reload --port 8000

:: Start frontend in background (same console = guardian)
echo [4/4] Starting frontend (port 5173)...
cd /d "%~dp0frontend"
start /b cmd /c "npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   Afterglow is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo ========================================
echo.
echo   Close this window to stop all services.
echo   Or press any key to stop gracefully.
echo.
pause >nul

:: Graceful cleanup (for key-press exit; window-close is handled by OS)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000.*LISTENING" 2^>nul') do taskkill /pid %%a /t /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173.*LISTENING" 2^>nul') do taskkill /pid %%a /t /f >nul 2>&1
echo Stopped.
