@echo off
REM ============================================================================
REM Weather Forecast Integration - Start All Services
REM ============================================================================
REM This script starts all services needed for:
REM - Claude Desktop (Weather API + MCP Server via stdio)
REM - n8n Direct API workflow (Weather API only)
REM - n8n MCP Bridge workflow (Weather API + MCP Bridge + MCP Server)
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════════╗
echo ║     Weather Forecast Integration - Starting All Services              ║
echo ╚════════════════════════════════════════════════════════════════════════╝
echo.

REM Check if running in correct directory
if not exist "WeatherForecastFastAPI" (
    echo [ERROR] Please run this script from the mcp-poc directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM ============================================================================
REM 1. Start Weather Forecast API (FastAPI)
REM ============================================================================
echo [1/2] Starting Weather Forecast API on port 3000...
echo.

cd WeatherForecastFastAPI

REM Check if virtual environment exists
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
    echo [INFO] Installing dependencies...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

REM Start FastAPI in new window
start "Weather API (Port 3000)" cmd /k "uvicorn main:app --reload --host 127.0.0.1 --port 3000"

echo [✓] Weather API started in new window
echo     URL: http://127.0.0.1:3000
echo     Swagger: http://127.0.0.1:3000/docs
echo.

cd ..

REM Wait a bit for API to start
timeout /t 3 /nobreak >nul

REM ============================================================================
REM 2. Start MCP Bridge (Optional - for n8n MCP workflow)
REM ============================================================================
echo [2/2] Starting MCP Bridge on port 9000...
echo.

cd WeatherForecastN8N

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing Node.js dependencies...
    call npm install
)

REM Check if dist folder exists
if not exist "dist" (
    echo [INFO] Building TypeScript code...
    call npm run build
)

REM Start MCP Bridge in new window
start "MCP Bridge (Port 9000)" cmd /k "node dist\mcp-bridge.js"

echo [✓] MCP Bridge started in new window
echo     URL: http://localhost:9000
echo     Health: http://localhost:9000/health
echo.

cd ..

REM ============================================================================
REM Summary
REM ============================================================================
echo.
echo ╔════════════════════════════════════════════════════════════════════════╗
echo ║                    All Services Started Successfully!                  ║
echo ╚════════════════════════════════════════════════════════════════════════╝
echo.
echo Services Running:
echo   [✓] Weather API         : http://127.0.0.1:3000
echo   [✓] MCP Bridge          : http://localhost:9000
echo   [✓] MCP Server          : Running via stdio (started by MCP Bridge)
echo.
echo Ready for:
echo   [✓] Claude Desktop      : MCP Server connects to Weather API
echo   [✓] n8n Direct API      : weather-ai-agent-chat-workflow.json
echo   [✓] n8n MCP Bridge      : weather-mcp-direct-workflow.json
echo.
echo To stop all services:
echo   - Close the command windows, or
echo   - Run: stop-all-services.bat
echo.
echo Press any key to exit this window (services will continue running)...
pause >nul
