# MCP Bridge Integration for n8n

## Overview

This folder contains n8n workflows for Weather Forecast integration with two architecture options:

1. **Direct API Access** (weather-ai-agent-chat-workflow.json) - Connects directly to FastAPI
2. **MCP Bridge** (optional) - Uses MCP Server for integration with Claude Desktop and n8n

The MCP Bridge provides a cleaner architecture where the MCP Server acts as the single source of truth for weather data access across multiple platforms.

## Architecture Options

### Option 1: Direct API (Default)
```
┌──────────────────┐
│   n8n Workflow   │
│   (AI Agent)     │
└────────┬─────────┘
         │ HTTP REST
         ▼
┌──────────────────┐
│  Weather API     │
│   (FastAPI)      │
│   Port: 3000     │
└──────────────────┘
```

### Option 2: MCP Bridge (Optional)
```
┌──────────────────┐
│   n8n Workflow   │
│   (AI Agent)     │
└────────┬─────────┘
         │ HTTP REST
         ▼
┌──────────────────┐
│   MCP Bridge     │
│  (Express.js)    │
│   Port: 9000     │
└────────┬─────────┘
         │ stdio (MCP Protocol)
         ▼
┌──────────────────┐
│   MCP Server     │
│   (Node.js)      │
└────────┬─────────┘
         │ HTTP REST
         ▼
┌──────────────────┐
│  Weather API     │
│   (FastAPI)      │
│   Port: 3000     │
└──────────────────┘
```

## Benefits

### Why Use MCP Bridge?

1. **Single Integration Point**: MCP Server is the single place that knows how to talk to the Weather API
2. **Reusability**: Same MCP Server works for both Claude Desktop and n8n
3. **Consistency**: Weather tools behave identically across all platforms
4. **Maintainability**: Changes to API integration only need to be made in one place
5. **Protocol Compliance**: Uses proper MCP protocol standards

### MCP Bridge vs Direct API

| Feature | MCP Bridge | Direct API |
|---------|------------|------------|
| Simplicity | Complex (3 layers) | ✅ Simple (1 layer) |
| Code Reuse | ✅ Reuses MCP Server | N/A |
| Maintenance | Single source of truth | Direct connection |
| Protocol | ✅ Standard MCP protocol | HTTP REST |
| Claude Desktop | ✅ Shared tools | ❌ Separate |
| Setup | More components | ✅ Minimal |

## Components

### 1. MCP Server (Already Built)
**Location**: `../WeatherForecastMCP/`
**Purpose**: Implements MCP protocol, communicates with Weather API
**Tools**: 9 weather tools

### 2. MCP Bridge (New)
**File**: `src/mcp-bridge.ts`
**Purpose**: Converts HTTP requests to MCP stdio protocol
**Port**: 9000

### 3. n8n Workflow
**File**: `weather-ai-agent-chat-workflow.json`
**Purpose**: AI Agent uses tools via MCP Bridge
**Updates**: Tool URLs point to MCP Bridge instead

## Setup Instructions

### Step 1: Build MCP Server

```bash
cd WeatherForecastMCP
npm install
npm run build
```

This creates `dist/index.js` that the MCP Bridge will communicate with.

### Step 2: Build MCP Bridge (Optional - only if using MCP Bridge)

```bash
cd WeatherForecastN8N
npm install
npm run build
```

This compiles `src/mcp-bridge.ts` to `dist/mcp-bridge.js`.

**Note**: Skip this step if using direct API access.

### Step 3: Start Services

**Terminal 1 - Weather API (Required):**
```bash
cd WeatherForecastFastAPI
uvicorn main:app --reload --host 127.0.0.1 --port 3000
```

**Terminal 2 - MCP Bridge (Optional - only if using MCP Bridge):**
```bash
cd WeatherForecastN8N
npm start
```

The MCP Bridge will automatically start the MCP Server as a child process.

### Step 4: Import n8n Workflow

1. Open n8n: http://localhost:5678
2. Import `weather-ai-agent-chat-workflow.json` (direct API) or `weather-mcp-direct-workflow.json` (MCP bridge)
3. Ensure Weather API is running
4. Activate and test

**Note**: The default workflow (`weather-ai-agent-chat-workflow.json`) connects directly to FastAPI on port 3000.

## MCP Bridge API

### Endpoints

#### Health Check
```bash
GET http://localhost:9000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "MCP Bridge for n8n",
  "mcpServerPath": "/path/to/MCP/Server"
}
```

#### List Tools
```bash
GET http://localhost:9000/tools
```

**Response:**
```json
{
  "success": true,
  "tools": [
    {
      "name": "get_weather_forecast",
      "description": "..."
    },
    ...
  ]
}
```

#### Call Tool (Generic)
```bash
POST http://localhost:9000/call/:toolName
Content-Type: application/json

{
  "param1": "value1",
  "param2": "value2"
}
```

#### Specific Tool Endpoints

These endpoints match the original HTTP wrapper for easy migration:

```bash
# Forecast
GET http://localhost:9000/tools/forecast?days=5

# Current Weather
GET http://localhost:9000/tools/current?city=London

# City Forecast
GET http://localhost:9000/tools/city-forecast?city=Tokyo&days=3

# Weather Alerts
GET http://localhost:9000/tools/alerts?city=Paris

# Statistics
GET http://localhost:9000/tools/statistics?days=7
```

## How It Works

### MCP Protocol Communication

1. **n8n makes HTTP request** to MCP Bridge:
   ```
   GET http://localhost:9000/tools/forecast?days=5
   ```

2. **MCP Bridge converts to MCP JSON-RPC**:
   ```json
   {
     "jsonrpc": "2.0",
     "id": "1",
     "method": "tools/call",
     "params": {
       "name": "get_weather_forecast",
       "arguments": { "days": 5 }
     }
   }
   ```

3. **Sends to MCP Server via stdio**:
   - MCP Bridge writes JSON to MCP Server's stdin
   - MCP Server processes request
   - MCP Server writes response to stdout

4. **MCP Bridge receives response**:
   ```json
   {
     "jsonrpc": "2.0",
     "id": "1",
     "result": {
       "content": [
         {
           "type": "text",
           "text": "... weather data ..."
         }
       ]
     }
   }
   ```

5. **Converts back to HTTP response**:
   ```json
   {
     "success": true,
     "data": [/* weather data */]
   }
   ```

6. **Returns to n8n**

## Configuration

### Environment Variables

**MCP_BRIDGE_PORT** (default: 9000):
```bash
MCP_BRIDGE_PORT=9000 npm run start:mcp
```

**MCP_SERVER_PATH** (auto-detected):
The bridge automatically finds the MCP Server at `../WeatherForecastMCP/dist/index.js`

### Change Ports

If port 9000 is busy:

1. Set environment variable:
   ```bash
   MCP_BRIDGE_PORT=8080 npm run start:mcp
   ```

2. Update n8n workflow tool URLs:
   ```
   http://localhost:8080/tools/forecast
   ```

## Which Option Should I Use?

### Use Direct API (Default) if:
- ✅ You only need n8n integration
- ✅ You want the simplest setup
- ✅ You don't use Claude Desktop
- ✅ You prefer minimal moving parts

### Use MCP Bridge if:
- ✅ You use both Claude Desktop and n8n
- ✅ You want consistent tools across platforms
- ✅ You prefer MCP protocol standards
- ✅ You want a single source of truth for weather tools

## Troubleshooting

### MCP Bridge Won't Start

**Error**: "Cannot find MCP Server"

**Solution**:
```bash
# Build MCP Server first
cd WeatherForecastMCP
npm install
npm run build

# Then start bridge
cd WeatherForecastN8N
npm run start:mcp
```

### MCP Server Not Responding

**Symptoms**: Timeouts, no responses

**Check**:
1. MCP Server path is correct
2. MCP Server built successfully
3. Weather API is running

**Debug**:
```bash
# Test MCP Server directly
cd WeatherForecastMCP
node test-mcp.js
```

### Tools Not Working

**Error**: "Tool call failed"

**Solutions**:
1. Check Weather API is running:
   ```bash
   curl http://127.0.0.1:3000/api/forecast/health
   ```

2. Check MCP Bridge logs:
   - Look for "MCP Server:" messages
   - Check for errors

3. Test MCP Bridge directly:
   ```bash
   curl http://localhost:9000/tools
   curl "http://localhost:9000/tools/forecast?days=3"
   ```

### Port Conflicts

**Error**: "Port 9000 already in use"

**Solution**:
```bash
# Use different port
MCP_BRIDGE_PORT=8080 npm run start:mcp

# Update n8n workflow URLs
```

## Testing

### Test MCP Bridge

```bash
# Health check
curl http://localhost:9000/health

# List tools
curl http://localhost:9000/tools

# Test forecast
curl "http://localhost:9000/tools/forecast?days=3"

# Test current weather
curl "http://localhost:9000/tools/current?city=London"

# Test with POST
curl -X POST http://localhost:9000/call/get_weather_forecast \
  -H "Content-Type: application/json" \
  -d '{"days": 5}'
```

### Test Full Stack

```bash
# 1. Weather API
curl http://127.0.0.1:3000/api/forecast/health

# 2. MCP Bridge
curl http://localhost:9000/health

# 3. MCP Bridge → MCP Server → Weather API
curl "http://localhost:9000/tools/forecast?days=3"
```

## Architecture Comparison

### Option 1: Direct API (Default)
```
n8n → Weather API (3000)
```
**Best for**: Simple n8n-only setup, minimal components

### Option 2: MCP Bridge (Optional)
```
n8n → MCP Bridge (9000) → MCP Server → Weather API (3000)
```
**Best for**: Unified architecture with Claude Desktop + n8n

## Summary

✅ **Direct API Access** - Default workflow connects directly to FastAPI (simplest)
✅ **MCP Bridge Available** - Optional unified architecture across Claude Desktop and n8n
✅ **Two Workflows** - Choose based on your needs
✅ **Full MCP Protocol** - Standard compliance when using MCP Bridge
✅ **Complete Documentation** - Setup and troubleshooting guides

**Default setup uses direct API for simplicity. Enable MCP Bridge for cross-platform consistency.**
