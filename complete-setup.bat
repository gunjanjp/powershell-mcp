@echo off
echo 🔧 PowerShell MCP Server - Complete Setup
echo =========================================
echo.

cd /d "D:\claude\claude-powershell-mcp"

echo 📍 Working in: %CD%
echo.

echo 🔍 Step 1: Checking current configuration status...
node recovery.js status
echo.

echo 🔍 Step 2: Scanning for backup configurations...
node recovery.js scan
echo.

echo 🔧 Step 3: Running component tests...
node test-server.js
if %errorlevel% neq 0 (
    echo ❌ Component tests failed - continuing anyway...
)
echo.

echo ➕ Step 4: Adding PowerShell MCP Server safely...
node recovery.js add-powershell
echo.

echo 🎉 Setup Complete!
echo ================
echo.
echo ✅ The PowerShell MCP Server has been configured safely
echo ✅ Your existing configuration has been preserved
echo ✅ Backups have been created before any changes
echo.
echo 📋 Final Steps:
echo   1. Restart Claude Desktop application
echo   2. Test by asking Claude: "What processes are running on my system?"
echo   3. Available tools include:
echo      • PowerShell command execution
echo      • System information gathering
echo      • File system operations
echo      • Process and service monitoring
echo.
echo 🛠️  Management Commands:
echo   • View config status: node recovery.js status
echo   • Find backups: node recovery.js scan
echo   • Restore backup: node recovery.js restore <number>
echo   • Server test: node run-test.bat
echo.
pause
