@echo off
echo 🔍 PowerShell MCP Server Diagnostics
echo ====================================
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found or not in PATH
    pause
    exit /b 1
)
echo ✅ Node.js is available
echo.

echo Checking project directory...
if not exist "src\server.js" (
    echo ❌ Server file not found: src\server.js
    pause
    exit /b 1
)
echo ✅ Server file exists
echo.

echo Checking dependencies...
if not exist "node_modules\zod" (
    echo ❌ Zod dependency not found - running npm install...
    npm install
)
echo ✅ Dependencies look good
echo.

echo Testing PowerShell...
powershell -Command "Write-Output 'PowerShell test successful'"
if %errorlevel% neq 0 (
    echo ❌ PowerShell test failed
    pause
    exit /b 1
)
echo ✅ PowerShell is working
echo.

echo Testing simple server components...
node test-server.js
if %errorlevel% neq 0 (
    echo ❌ Component test failed
    pause
    exit /b 1
)
echo.

echo 🎉 All diagnostics passed!
echo.
echo 💡 To test the server:
echo    1. Run: node src\server-simple.js
echo    2. Configure Claude Desktop to use this server
echo    3. Test with Claude
echo.
pause
