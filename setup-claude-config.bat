@echo off
echo 🔧 Claude Desktop Configuration Update Tool
echo ===========================================
echo.

echo Step 1: Backing up existing configuration...
set "CONFIG_PATH=%APPDATA%\Claude\claude_desktop_config.json"

if exist "%CONFIG_PATH%" (
    copy "%CONFIG_PATH%" "%CONFIG_PATH%.backup" >nul 2>&1
    echo ✅ Backup created: %CONFIG_PATH%.backup
) else (
    echo ℹ️ No existing configuration found
    mkdir "%APPDATA%\Claude" 2>nul
)

echo.
echo Step 2: Installing fixed configuration...
echo Current directory: %CD%
echo Target config: %CONFIG_PATH%

copy claude_desktop_config_fixed.json "%CONFIG_PATH%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Configuration updated successfully
) else (
    echo ❌ Failed to update configuration
    echo.
    echo Manual setup required:
    echo 1. Copy this content to: %CONFIG_PATH%
    echo.
    type claude_desktop_config_fixed.json
    echo.
    pause
    goto :end
)

echo.
echo Step 3: Verifying configuration...
echo ====================================
type "%CONFIG_PATH%"
echo ====================================
echo.

echo Step 4: Testing server path...
if exist "src\server-fixed.js" (
    echo ✅ Server file exists at: %CD%\src\server-fixed.js
) else (
    echo ❌ Server file not found!
    echo Expected: %CD%\src\server-fixed.js
    goto :error
)

echo.
echo 🎉 Configuration updated successfully!
echo.
echo 🔄 Next steps:
echo    1. COMPLETELY CLOSE Claude Desktop (check Task Manager)
echo    2. Wait 5 seconds
echo    3. Start Claude Desktop again
echo    4. Test with: "Execute PowerShell: Get-Date"
echo.
echo 💡 The server now uses stderr for logging, so it won't interfere with JSON-RPC
echo.
pause
goto :end

:error
echo.
echo ❌ Setup failed. Please manually:
echo    1. Edit: %CONFIG_PATH%
echo    2. Copy content from: claude_desktop_config_fixed.json
echo    3. Restart Claude Desktop
echo.
pause

:end
