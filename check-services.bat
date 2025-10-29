@echo off
REM ============================================================================
REM Weather Forecast Integration - Check Service Status
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════════╗
echo ║         Weather Forecast Integration - Service Status Check           ║
echo ╚════════════════════════════════════════════════════════════════════════╝
echo.

REM Check Weather API (port 3000)
echo [1/3] Checking Weather API (port 3000)...
curl -s http://127.0.0.1:3000/api/forecast/health >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [✓] Weather API is RUNNING
    curl -s http://127.0.0.1:3000/api/forecast/health
) else (
    echo [✗] Weather API is NOT running
    echo     Start with: start-all-services.bat
)
echo.

REM Check MCP Bridge (port 9000)
echo [2/3] Checking MCP Bridge (port 9000)...
curl -s http://localhost:9000/health >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [✓] MCP Bridge is RUNNING
    curl -s http://localhost:9000/health
) else (
    echo [✗] MCP Bridge is NOT running
    echo     Start with: start-all-services.bat
)
echo.

REM Check port listeners
echo [3/3] Checking port listeners...
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [✓] Port 3000 is in use (Weather API)
) else (
    echo [✗] Port 3000 is free
)

netstat -ano | findstr :9000 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [✓] Port 9000 is in use (MCP Bridge)
) else (
    echo [✗] Port 9000 is free
)

echo.
echo ╔════════════════════════════════════════════════════════════════════════╗
echo ║                         Status Check Complete                          ║
echo ╚════════════════════════════════════════════════════════════════════════╝
echo.
pause
