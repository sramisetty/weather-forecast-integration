@echo off
REM ============================================================================
REM Weather Forecast Integration - Stop All Services
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════════╗
echo ║     Weather Forecast Integration - Stopping All Services              ║
echo ╚════════════════════════════════════════════════════════════════════════╝
echo.

REM Kill Weather API (uvicorn/python)
echo [1/2] Stopping Weather API...
taskkill /FI "WINDOWTITLE eq Weather API (Port 3000)*" /F >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [✓] Weather API stopped
) else (
    echo [i] Weather API was not running
)

REM Kill MCP Bridge (node)
echo [2/2] Stopping MCP Bridge...
taskkill /FI "WINDOWTITLE eq MCP Bridge (Port 9000)*" /F >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [✓] MCP Bridge stopped
) else (
    echo [i] MCP Bridge was not running
)

REM Also kill any orphaned processes on these ports
echo.
echo Cleaning up any remaining processes on ports 3000 and 9000...

REM Find and kill process on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Find and kill process on port 9000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :9000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ╔════════════════════════════════════════════════════════════════════════╗
echo ║                    All Services Stopped Successfully!                  ║
echo ╚════════════════════════════════════════════════════════════════════════╝
echo.
echo All services have been stopped.
echo.
pause
