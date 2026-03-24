@echo off
echo ===================================
echo   Starting SLIIT Events Servers
echo ===================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Services are starting in new windows!
echo Once they are ready, you can access the app at http://localhost:5173
pause
