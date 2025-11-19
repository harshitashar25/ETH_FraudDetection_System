@echo off
echo ========================================
echo Complete Project Restart
echo ========================================
echo.
echo This will:
echo   1. Stop all running Node.js processes
echo   2. Clear ports 5000, 3001, 8545
echo   3. Start Backend, Frontend, and Blockchain
echo.
echo Press any key to continue...
pause >nul

echo.
echo Step 1: Stopping all processes...
call stop-all.bat

echo.
echo Step 2: Waiting 3 seconds before restart...
timeout /t 3 /nobreak >nul

echo.
echo Step 3: Starting all services...
call start-all.bat

echo.
echo ========================================
echo ✅ Restart complete!
echo.
echo Services are starting in separate windows.
echo Check each window for startup messages.
echo ========================================
echo.

