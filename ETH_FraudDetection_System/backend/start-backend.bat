@echo off
echo ========================================
echo Starting Moralis Trail Backend Server
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please create a .env file with:
    echo   MORALIS_API_KEY=your_key_here
    echo   PORT=5000
    echo.
    pause
    exit /b 1
)

echo Checking for node_modules...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting server...
echo.
npm start

