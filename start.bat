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

:: Find free backend port starting from 8000
set BACKEND_PORT=8000
:find_backend_port
netstat -ano | findstr ":%BACKEND_PORT%.*LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo       Port %BACKEND_PORT% occupied, trying next...
    set /a BACKEND_PORT+=1
    goto :find_backend_port
)

:: Find free frontend port starting from 5173
set FRONTEND_PORT=5173
:find_frontend_port
netstat -ano | findstr ":%FRONTEND_PORT%.*LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo       Port %FRONTEND_PORT% occupied, trying next...
    set /a FRONTEND_PORT+=1
    goto :find_frontend_port
)

:: Export backend port so Vite proxy can read it
set VITE_BACKEND_PORT=%BACKEND_PORT%

:: Start backend in background (same console = guardian)
echo [3/4] Starting backend (port %BACKEND_PORT%)...
cd /d "%~dp0backend"
start /b python -m uvicorn app.main:app --reload --port %BACKEND_PORT%

:: Start frontend in background (same console = guardian)
echo [4/4] Starting frontend (port %FRONTEND_PORT%)...
cd /d "%~dp0frontend"
start /b cmd /c "npm run dev -- --port %FRONTEND_PORT%"

timeout /t 3 /nobreak >nul
start http://localhost:%FRONTEND_PORT%

echo.
echo ========================================
echo   Afterglow is running!
echo   Frontend: http://localhost:%FRONTEND_PORT%
echo   Backend:  http://localhost:%BACKEND_PORT%
echo ========================================
echo.
echo   Close this window to stop all services.
echo   Or press any key to stop gracefully.
echo.
pause >nul

:: Graceful cleanup
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%BACKEND_PORT%.*LISTENING" 2^>nul') do taskkill /pid %%a /t /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%FRONTEND_PORT%.*LISTENING" 2^>nul') do taskkill /pid %%a /t /f >nul 2>&1
echo Stopped.
