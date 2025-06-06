@echo off
echo 🔧 Testing Fixed PowerShell MCP Server
echo ======================================
echo.

echo Testing server-fixed.js for 3 seconds...
echo (Should only show JSON-RPC output on stdout)
echo.

timeout /t 3 >nul & taskkill /f /im node.exe >nul 2>&1 & (
    echo Starting server for 3 seconds...
    node src\server-fixed.js 2>server-stderr.log
) 

echo.
echo ✅ Test completed
echo.

if exist "server-stderr.log" (
    echo 📄 Server log output (should contain our logging messages):
    echo ================================================
    type server-stderr.log
    echo ================================================
    echo.
    echo ✅ Logging is correctly going to stderr (good!)
    del server-stderr.log
) else (
    echo ❌ No stderr log found
)

echo.
echo 💡 If no "PowerShell" text appeared above the test, the fix worked!
echo 💡 Claude Desktop should now work correctly.
echo.
echo 🔄 Next steps:
echo    1. Update Claude Desktop config
echo    2. Restart Claude Desktop
echo    3. Test with Claude
echo.
pause
