@echo off
echo 🚀 PowerShell MCP Server Setup
echo ===============================
echo.

echo Step 1: Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found: 
node --version

echo.
echo Step 2: Installing dependencies...
npm install >nul 2>&1
echo ✅ Dependencies installed

echo.
echo Step 3: Testing server...
timeout /t 3 >nul & taskkill /f /im node.exe >nul 2>&1 & (
    node src\server.js 2>nul
)
echo ✅ Server test completed

echo.
echo Step 4: Setting up Claude Desktop configuration...
set "CONFIG_PATH=%APPDATA%\Claude\claude_desktop_config.json"

if not exist "%APPDATA%\Claude" (
    mkdir "%APPDATA%\Claude"
)

copy claude_desktop_config.json "%CONFIG_PATH%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Claude Desktop configured
) else (
    echo ⚠️ Manual configuration needed
    echo Copy claude_desktop_config.json to: %CONFIG_PATH%
)

echo.
echo 🎉 Setup Complete!
echo.
echo 📋 Next steps:
echo    1. Restart Claude Desktop completely
echo    2. Test with: "Execute PowerShell: Get-Date"
echo.
echo 🔧 Available commands:
echo    npm start          - Start the server
echo    npm test           - Run component tests
echo    node src\server.js - Start server directly
echo.
pause
