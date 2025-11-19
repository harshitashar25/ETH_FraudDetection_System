@echo off
echo ========================================
echo Starting Frontend React App
echo ========================================
echo.

echo Checking for node_modules...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting React development server...
echo.
npm start

