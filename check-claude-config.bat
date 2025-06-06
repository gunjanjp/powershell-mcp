@echo off
echo 🔍 Claude Desktop Configuration Checker
echo ========================================
echo.

echo Step 1: Locating Claude Desktop config file...
set "CONFIG_PATH=%APPDATA%\Claude\claude_desktop_config.json"
echo Config path: %CONFIG_PATH%

if not exist "%CONFIG_PATH%" (
    echo ❌ ERROR: Claude Desktop config file not found
    echo 💡 Creating directory structure...
    mkdir "%APPDATA%\Claude" 2>nul
    echo.
    echo 📝 Sample configuration:
    echo {
    echo   "mcpServers": {
    echo     "powershell": {
    echo       "command": "node",
    echo       "args": ["D:/claude/claude-powershell-mcp/src/server-standalone.js"],
    echo       "env": {}
    echo     }
    echo   }
    echo }
    echo.
    echo 💡 Please create the config file at: %CONFIG_PATH%
    goto :end
)

echo ✅ Config file found
echo.

echo Step 2: Displaying current configuration...
echo ==========================================
type "%CONFIG_PATH%"
echo.
echo ==========================================
echo.

echo Step 3: Checking server path...
node -e "
const fs = require('fs');
const path = require('path');
try {
  const config = JSON.parse(fs.readFileSync('%CONFIG_PATH%', 'utf8'));
  if (config.mcpServers && config.mcpServers.powershell) {
    const serverPath = config.mcpServers.powershell.args[0];
    console.log('Server path from config:', serverPath);
    
    // Check if path exists
    if (fs.existsSync(serverPath)) {
      console.log('✅ Server file exists');
    } else {
      console.log('❌ ERROR: Server file not found at:', serverPath);
    }
  } else {
    console.log('❌ ERROR: PowerShell MCP server not configured');
  }
} catch (error) {
  console.log('❌ ERROR: Invalid JSON configuration:', error.message);
}
"

echo.
echo Step 4: Testing server path directly...
if exist "src\server-standalone.js" (
    echo ✅ Local server file exists
    echo 📍 Recommended path: %CD%\src\server-standalone.js
) else (
    echo ❌ ERROR: Local server file not found
)

echo.
echo 💡 Next steps:
echo    1. Update Claude Desktop config with correct path
echo    2. Restart Claude Desktop completely
echo    3. Check Claude Desktop logs for specific errors
echo.
pause

:end
