@echo off
echo 🚀 Running PowerShell MCP Server Test...
echo ========================================
echo.

cd /d "D:\claude\claude-powershell-mcp"

echo 📍 Current directory: %CD%
echo.

echo 🧪 Testing server components...
node test-server.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Test failed with exit code %errorlevel%
    echo 💡 Check the error messages above
    pause
    exit /b %errorlevel%
)

echo.
echo 🎉 Test completed successfully!
echo.
echo 💡 Next steps:
echo   1. Run: node recovery.js status
echo   2. Run: node recovery.js add-powershell
echo   3. Restart Claude Desktop
echo.
pause
