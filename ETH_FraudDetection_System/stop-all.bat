@echo off
echo ========================================
echo Stopping All Node.js Processes
echo ========================================
echo.

echo Killing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ All Node.js processes stopped
) else (
    echo ℹ️  No Node.js processes found (or already stopped)
)

echo.
echo Checking for processes on common ports...
echo.

echo Checking port 5000 (Backend)...
netstat -ano | findstr :5000 >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 5000 is still in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        echo    Attempting to kill PID: %%a
        taskkill /F /PID %%a >nul 2>&1
    )
) else (
    echo ✅ Port 5000 is free
)

echo.
echo Checking port 3001 (Frontend)...
netstat -ano | findstr :3001 >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 3001 is still in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        echo    Attempting to kill PID: %%a
        taskkill /F /PID %%a >nul 2>&1
    )
) else (
    echo ✅ Port 3001 is free
)

echo.
echo Checking port 8545 (Blockchain)...
netstat -ano | findstr :8545 >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 8545 is still in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8545') do (
        echo    Attempting to kill PID: %%a
        taskkill /F /PID %%a >nul 2>&1
    )
) else (
    echo ✅ Port 8545 is free
)

echo.
echo ========================================
echo ✅ All processes stopped!
echo.
echo You can now restart the services.
echo ========================================
echo.
pause

