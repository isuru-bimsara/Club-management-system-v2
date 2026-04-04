@echo off
echo ===================================
echo   SLIIT Events Setup properly
echo ===================================

echo.
echo Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo Setup Complete! 
echo You can now use start.bat to launch the application.
pause
