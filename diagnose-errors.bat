@echo off
echo 🔍 PowerShell MCP Error Diagnostic Tool
echo =======================================
echo.

echo Step 1: Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js not found in PATH
    echo 💡 Please install Node.js or add it to your PATH
    goto :error
) else (
    echo ✅ Node.js found:
    node --version
)
echo.

echo Step 2: Checking NPM...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: NPM not found
    goto :error
) else (
    echo ✅ NPM found:
    npm --version
)
echo.

echo Step 3: Checking project structure...
if not exist "package.json" (
    echo ❌ ERROR: package.json not found
    echo 💡 Make sure you're in the PowerShell MCP project directory
    goto :error
)
echo ✅ package.json found

if not exist "src" (
    echo ❌ ERROR: src directory not found
    goto :error
)
echo ✅ src directory found

if not exist "node_modules" (
    echo ❌ ERROR: node_modules not found - running npm install...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ ERROR: npm install failed
        goto :error
    )
)
echo ✅ node_modules found
echo.

echo Step 4: Testing minimal components...
echo Running minimal test suite...
node minimal-test.js
if %errorlevel% neq 0 (
    echo ❌ ERROR: Minimal tests failed
    echo.
    echo 🔍 Possible issues:
    echo    - Missing dependencies
    echo    - Node.js version incompatibility
    echo    - PowerShell not accessible
    echo    - MCP SDK import issues
    goto :error
)
echo.

echo Step 5: Testing standalone server (5 second test)...
echo Starting standalone server for 5 seconds...
timeout /t 5 /nobreak >nul & taskkill /f /im node.exe >nul 2>&1 & (
    node src\server-standalone.js
) 2>&1 | findstr /v "taskkill"

echo.
echo 🎉 Diagnostics complete!
echo.
echo 💡 Next steps:
echo    1. If tests passed: node src\server-standalone.js
echo    2. Configure Claude Desktop with the standalone server
echo    3. If still having issues, share the error output above
echo.
pause
goto :end

:error
echo.
echo ❌ DIAGNOSTIC FAILED
echo.
echo 🔧 Common solutions:
echo    1. Install Node.js 18+ from nodejs.org
echo    2. Run: npm install
echo    3. Check you're in the correct directory
echo    4. Run as Administrator if needed
echo.
pause

:end
