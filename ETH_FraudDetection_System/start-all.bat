@echo off
echo ========================================
echo Starting All Services
echo ========================================
echo.
echo This will open 3 separate windows:
echo   1. Backend Server (port 5000)
echo   2. Frontend Server (port 3001)
echo   3. Blockchain Node (port 8545) - Optional
echo.
pause

echo.
echo Starting Backend Server...
start "Backend Server - Port 5000" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend Server - Port 3001" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo ✅ Services are starting!
echo.
echo Windows opened:
echo   - Backend Server (port 5000)
echo   - Frontend Server (port 3001)
echo.
echo Wait for:
echo   Backend: "✅ Server running on port 5000"
echo   Frontend: "Compiled successfully!"
echo.
echo To start Blockchain node manually:
echo   cd blockchain
echo   npm run node
echo ========================================
echo.
pause

