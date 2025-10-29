# Service Management Scripts

This folder contains Windows batch scripts to easily manage all Weather Forecast Integration services.

## Scripts Overview

### 🚀 start-all-services.bat
**Purpose**: Start all required services for Claude Desktop and n8n workflows

**What it does**:
1. Starts Weather Forecast API (FastAPI) on port 3000
2. Starts MCP Bridge on port 9000 (which auto-starts MCP Server)
3. Creates Python virtual environment if needed
4. Installs dependencies if needed
5. Opens services in separate command windows

**Usage**:
```bash
# Double-click the file, or run from command line:
start-all-services.bat
```

**Services Started**:
- ✅ Weather API: http://127.0.0.1:3000 (Swagger: /docs)
- ✅ MCP Bridge: http://localhost:9000
- ✅ MCP Server: stdio (started automatically by MCP Bridge)

---

### 🛑 stop-all-services.bat
**Purpose**: Stop all running services

**What it does**:
1. Kills Weather API processes
2. Kills MCP Bridge processes
3. Cleans up any orphaned processes on ports 3000 and 9000

**Usage**:
```bash
# Double-click the file, or run from command line:
stop-all-services.bat
```

---

### 🔍 check-services.bat
**Purpose**: Check status of all services

**What it does**:
1. Checks if Weather API is responding
2. Checks if MCP Bridge is responding
3. Checks if ports 3000 and 9000 are in use
4. Displays health check responses

**Usage**:
```bash
# Double-click the file, or run from command line:
check-services.bat
```

**Output**:
```
[✓] Weather API is RUNNING
[✓] MCP Bridge is RUNNING
[✓] Port 3000 is in use (Weather API)
[✓] Port 9000 is in use (MCP Bridge)
```

---

## Quick Start Guide

### First Time Setup

1. **Start Services**:
   ```bash
   start-all-services.bat
   ```
   This will automatically:
   - Create Python virtual environment
   - Install Python dependencies
   - Install Node.js dependencies
   - Build TypeScript code
   - Start all services

2. **Check Status**:
   ```bash
   check-services.bat
   ```

3. **Use the Services**:
   - **Claude Desktop**: Automatically uses MCP Server (configured separately)
   - **n8n Direct API**: Import `weather-ai-agent-chat-workflow.json`
   - **n8n MCP Bridge**: Import `weather-mcp-direct-workflow.json`

### Daily Usage

**Starting Work**:
```bash
start-all-services.bat
```

**Checking Status**:
```bash
check-services.bat
```

**Ending Work**:
```bash
stop-all-services.bat
```

---

## Service Architecture

### For Claude Desktop
```
Claude Desktop → MCP Server (stdio) → Weather API (3000)
```
**Required**: Weather API only
**Start**: `start-all-services.bat` (starts everything including API)

### For n8n Direct API Workflow
```
n8n → Weather API (3000)
```
**Required**: Weather API only
**Workflow**: `weather-ai-agent-chat-workflow.json`

### For n8n MCP Bridge Workflow
```
n8n → MCP Bridge (9000) → MCP Server (stdio) → Weather API (3000)
```
**Required**: Weather API + MCP Bridge
**Workflow**: `weather-mcp-direct-workflow.json`

---

## Troubleshooting

### Services Won't Start

**Problem**: Port already in use

**Solution**:
```bash
# Stop all services first
stop-all-services.bat

# Then start again
start-all-services.bat
```

### Services Not Responding

**Check Status**:
```bash
check-services.bat
```

**Manual Check**:
```bash
# Check Weather API
curl http://127.0.0.1:3000/api/forecast/health

# Check MCP Bridge
curl http://localhost:9000/health
```

### Python Virtual Environment Issues

**Delete and Recreate**:
```bash
cd WeatherForecastFastAPI
rmdir /s /q venv
cd ..
start-all-services.bat
```

### Node.js Build Issues

**Rebuild**:
```bash
cd WeatherForecastN8N
rmdir /s /q node_modules dist
npm install
npm run build
cd ..
start-all-services.bat
```

---

## Manual Service Management

If you prefer to start services manually:

### Weather API
```bash
cd WeatherForecastFastAPI
venv\Scripts\activate
uvicorn main:app --reload --host 127.0.0.1 --port 3000
```

### MCP Bridge
```bash
cd WeatherForecastN8N
npm run build
node dist\mcp-bridge.js
```

---

## Requirements

- **Python 3.8+**: For Weather API
- **Node.js 18+**: For MCP Bridge and MCP Server
- **curl**: For health checks (usually pre-installed on Windows 10+)

---

## Support

For issues or questions:
1. Check service status: `check-services.bat`
2. Review logs in the service windows
3. Check troubleshooting guides in component README files
4. Open an issue on GitHub

---

**All scripts created with assistance**
