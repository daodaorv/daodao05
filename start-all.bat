@echo off
chcp 65001 > nul
title DaoDaoRV Project Launcher

echo ====================================
echo     DaoDaoRV Project Launcher
echo ====================================
echo.

:: Check Docker
echo [1/4] Checking Docker...
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo OK: Docker is running
echo.

:: Start Database Services
echo [2/4] Starting Database Services...
docker compose up -d mysql redis
if %errorlevel% neq 0 (
    echo ERROR: Failed to start database services
    pause
    exit /b 1
)
echo OK: Database services started
echo Waiting for database to be ready...
timeout /t 10 /nobreak > nul
echo.

:: Start Backend API
echo [3/4] Starting Backend API...
cd /d "%~dp0backend"
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)
start "Backend API - Port 3000" cmd /k "npm run dev"
echo OK: Backend API starting on http://localhost:3000
echo Waiting for backend to be ready...
timeout /t 8 /nobreak > nul
echo.

:: Start Admin Console
echo [4/4] Starting Admin Console...
cd /d "%~dp0admin-console"
if not exist "node_modules" (
    echo Installing admin console dependencies...
    call npm install
)
start "Admin Console - Port 5173" cmd /k "npm run dev"
echo OK: Admin Console starting on http://localhost:5173
echo Waiting for admin console to be ready...
timeout /t 8 /nobreak > nul
echo.

echo.
echo ====================================
echo   All Services Started Successfully!
echo ====================================
echo.
echo Service URLs:
echo   - Backend API:      http://localhost:3000
echo   - Admin Console:    http://localhost:5173
echo   - Database Admin:   http://localhost:8080
echo.
echo Development Tools:
echo   - MiniProgram:  Open 'miniprogram' folder in HBuilderX
echo   - Mobile Admin: Open 'mobile-admin' folder in HBuilderX
echo.
echo Test Account:
echo   - Phone: 13800138000
echo   - Password: 123456
echo.
echo Press any key to open Admin Console in browser...
pause > nul

:: Open Admin Console in browser
start http://localhost:5173

echo.
echo To stop services: Close the terminal windows
echo.
pause

