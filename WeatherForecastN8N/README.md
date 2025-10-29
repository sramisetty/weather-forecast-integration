# Weather Forecast n8n AI Agent Integration

Complete n8n AI Agent workflow with HTTP wrapper for Weather Forecast API integration.

## Overview

This project provides:
1. **HTTP Wrapper Service** - Exposes Weather Forecast tools as REST endpoints for n8n
2. **n8n Workflow JSON** - Pre-configured AI Agent workflow with 6 weather tools
3. **Complete Integration** - Connect n8n AI Agent to Weather Forecast API

## Architecture

```
┌─────────────────┐
│  n8n AI Agent   │
│  (with Tools)   │
└────────┬────────┘
         │ HTTP REST
         │
┌────────▼────────┐
│  HTTP Wrapper   │
│  (Express.js)   │
│  Port: 5000     │
└────────┬────────┘
         │ HTTP REST
         │
┌────────▼────────┐
│  Weather API    │
│  (FastAPI)      │
│  Port: 3000     │
└─────────────────┘
```

## Components

### 1. HTTP Wrapper Service
- **Port**: 5000
- **Purpose**: Converts Weather API to n8n-compatible HTTP endpoints
- **Technology**: Express.js + TypeScript

### 2. n8n Workflow
- **File**: `weather-ai-agent-workflow.json`
- **Type**: AI Agent workflow
- **Tools**: 6 weather tools configured

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- n8n installed (self-hosted or cloud)
- Weather Forecast API running on port 3000
- OpenAI API key (for AI Agent)

## Installation

### Step 1: Install Dependencies

```bash
cd WeatherForecastN8N
npm install
```

### Step 2: Build the HTTP Wrapper

```bash
npm run build
```

### Step 3: Start the HTTP Wrapper

```bash
npm start
```

The wrapper will start on `http://localhost:5000`

You should see:
```
╔════════════════════════════════════════════════════════════╗
║  Weather Forecast HTTP Wrapper for n8n                    ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:5000                  ║
║  Weather API URL:   http://127.0.0.1:3000                  ║
╚════════════════════════════════════════════════════════════╝
```

## HTTP Wrapper Endpoints

### Discovery Endpoints

- `GET /` - API information
- `GET /tools` - List all available tools
- `GET /docs` - API documentation

### Weather Tool Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /tools/forecast` | Get weather forecast | `days` (optional, default: 5) |
| `GET /tools/current` | Get current weather | `city` (optional) |
| `GET /tools/city-forecast` | Get city forecast | `city` (required), `days` (optional) |
| `GET /tools/detailed` | Get detailed forecast | `date` (required), `city` (optional) |
| `GET /tools/detailed-multi` | Get detailed multi-day | `days` (optional, default: 5) |
| `GET /tools/alerts` | Get weather alerts | `city` (optional) |
| `GET /tools/statistics` | Get weather statistics | `days` (optional, default: 7) |
| `GET /tools/health` | Health check | None |

### Response Format

All endpoints return:
```json
{
  "success": true,
  "data": { /* weather data */ }
}
```

Or on error:
```json
{
  "success": false,
  "error": "error message"
}
```

## n8n Integration

### Step 1: Import Workflow

1. Open n8n
2. Click on "Workflows" → "Import from File"
3. Select `weather-ai-agent-workflow.json`
4. The workflow will be imported

### Step 2: Configure OpenAI

1. Click on the "OpenAI Chat Model" node
2. Add your OpenAI API key
3. Configure the model (default: gpt-4)
4. Save the node

### Step 3: Verify HTTP Wrapper

Ensure the HTTP wrapper is running:
```bash
curl http://localhost:5000/tools
```

### Step 4: Test the Workflow

1. Click "Execute Workflow" in n8n
2. Enter a test query like: "What's the weather forecast for the next 5 days?"
3. The AI Agent will use the appropriate tools to respond

## Available Tools in n8n Workflow

The workflow includes these 6 pre-configured tools:

### 1. Weather Forecast Tool
- **Function**: Get multi-day forecast
- **Parameters**: `days` (1-30)
- **Endpoint**: `/tools/forecast`

### 2. Current Weather Tool
- **Function**: Get current weather
- **Parameters**: `city` (optional)
- **Endpoint**: `/tools/current`

### 3. City Forecast Tool
- **Function**: Get forecast for specific city
- **Parameters**: `city` (required), `days` (optional)
- **Endpoint**: `/tools/city-forecast`

### 4. Weather Alerts Tool
- **Function**: Get active alerts
- **Parameters**: `city` (optional)
- **Endpoint**: `/tools/alerts`

### 5. Weather Statistics Tool
- **Function**: Get weather stats
- **Parameters**: `days` (1-365)
- **Endpoint**: `/tools/statistics`

### 6. Detailed Forecast Tool
- **Function**: Get detailed multi-day forecast
- **Parameters**: `days` (1-30)
- **Endpoint**: `/tools/detailed-multi`

## Example Queries for AI Agent

Once configured, you can ask the AI Agent:

- "What's the weather forecast for the next 5 days?"
- "Show me current weather in London"
- "Get weather for Tokyo for the next 3 days"
- "Are there any weather alerts?"
- "What are the weather statistics for the past week?"
- "Give me a detailed forecast for the next 2 days"

The AI Agent will automatically select and use the appropriate tools.

## Configuration

### Environment Variables

Create a `.env` file (optional):

```env
PORT=5000
WEATHER_API_URL=http://127.0.0.1:3000
```

### Change Ports

**HTTP Wrapper Port:**
Edit `package.json` or set `PORT` environment variable:
```bash
PORT=8080 npm start
```

**Weather API URL:**
If your Weather API is on a different port:
```bash
WEATHER_API_URL=http://localhost:8000 npm start
```

## Testing

### Test HTTP Wrapper

```bash
# List tools
curl http://localhost:5000/tools

# Get forecast
curl "http://localhost:5000/tools/forecast?days=3"

# Get current weather for London
curl "http://localhost:5000/tools/current?city=London"

# Get weather alerts
curl "http://localhost:5000/tools/alerts"

# Get statistics
curl "http://localhost:5000/tools/statistics?days=7"

# Health check
curl "http://localhost:5000/tools/health"
```

### Test in n8n

1. Import the workflow
2. Configure OpenAI credentials
3. Execute workflow with test query
4. Check the AI Agent response

## Project Structure

```
WeatherForecastN8N/
├── src/
│   └── http-wrapper.ts          # HTTP wrapper service
├── dist/                        # Compiled JavaScript
├── weather-ai-agent-workflow.json  # n8n workflow
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── README.md                   # This file
└── SETUP.md                    # Quick setup guide
```

## Development

### Watch Mode

```bash
npm run watch
```

This will rebuild automatically when you change TypeScript files.

### Adding New Tools

1. Add endpoint to `src/http-wrapper.ts`
2. Rebuild: `npm run build`
3. Restart server: `npm start`
4. Add new HTTP Request tool node in n8n workflow
5. Connect to AI Agent

## Troubleshooting

### HTTP Wrapper Won't Start

- Check if port 5000 is available
- Verify Node.js is installed: `node --version`
- Check dependencies: `npm install`
- Build project: `npm run build`

### n8n Can't Connect to Tools

- Ensure HTTP wrapper is running on port 5000
- Verify URL in n8n HTTP Request nodes: `http://localhost:5000`
- Check Weather API is running on port 3000
- Test wrapper directly: `curl http://localhost:5000/tools`

### AI Agent Not Using Tools

- Verify OpenAI API key is configured
- Check tool descriptions are clear
- Ensure all tool nodes are connected to AI Agent
- Test tools individually in n8n

### Connection Errors

```bash
# Test Weather API
curl http://127.0.0.1:3000/api/forecast/health

# Test HTTP Wrapper
curl http://localhost:5000/tools/health

# Check if services are running
netstat -an | findstr "3000 5000"  # Windows
netstat -an | grep "3000\|5000"    # Linux/Mac
```

## Running Multiple Services

You need these services running simultaneously:

1. **Weather API** (Port 3000):
   ```bash
   cd WeatherForecastFastAPI
   uvicorn main:app --reload --host 127.0.0.1 --port 3000
   ```

2. **HTTP Wrapper** (Port 5000):
   ```bash
   cd WeatherForecastN8N
   npm start
   ```

3. **n8n** (Default: Port 5678):
   ```bash
   n8n start
   ```

## Workflow Customization

### Modify Tool Parameters

Edit `weather-ai-agent-workflow.json`:

1. Find the tool node
2. Update `queryParameters`
3. Import updated workflow to n8n

### Add More Tools

1. Add endpoint to HTTP wrapper
2. Create new HTTP Request tool node in n8n
3. Configure endpoint URL and parameters
4. Connect to AI Agent node
5. Test the workflow

### Change AI Model

1. Click "OpenAI Chat Model" node
2. Select different model (gpt-3.5-turbo, gpt-4, etc.)
3. Save and test

## API Documentation

### GET /tools

Returns list of all available tools:

```json
{
  "tools": [
    {
      "name": "get_weather_forecast",
      "endpoint": "/tools/forecast",
      "method": "GET",
      "description": "Get weather forecast...",
      "parameters": { "days": "..." }
    },
    ...
  ]
}
```

### GET /docs

Returns complete API documentation with examples.

## Technologies Used

- **TypeScript**: Type-safe development
- **Express.js**: HTTP server
- **Axios**: HTTP client for Weather API
- **CORS**: Cross-origin support
- **n8n**: Workflow automation and AI Agent

## Support

- **HTTP Wrapper Issues**: Check logs and curl test endpoints
- **n8n Issues**: Check n8n console and node configurations
- **Weather API Issues**: See WeatherForecastFastAPI documentation

## License

MIT License

## Related Projects

- Weather Forecast API: `../WeatherForecastFastAPI/`
- MCP Server: `../WeatherForecastMCP/`

---

**Ready to use with n8n AI Agent!** 🚀
