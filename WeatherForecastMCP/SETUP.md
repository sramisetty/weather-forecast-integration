# Quick Setup Guide

## Prerequisites
- ✓ Node.js installed
- ✓ Weather Forecast FastAPI running on http://127.0.0.1:3000

## Setup Steps

### 1. Install Dependencies
```bash
cd WeatherForecastMCP
npm install
```

### 2. Build the MCP Server
```bash
npm run build
```

### 3. Test the Connection
```bash
node test-mcp.js
```

You should see all tests pass with ✓ marks.

## Using with Claude Desktop

### Step 1: Locate Claude Config File

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Mac:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Add MCP Server Configuration

Edit the config file and add:

```json
{
  "mcpServers": {
    "weather-forecast": {
      "command": "node",
      "args": [
        "C:\\Users\\sramisetty\\Work\\mcp-poc\\WeatherForecastMCP\\dist\\index.js"
      ],
      "env": {
        "WEATHER_API_URL": "http://127.0.0.1:3000"
      }
    }
  }
}
```

**Important:** Update the path in `args` to match your actual installation directory!

### Step 3: Restart Claude Desktop

1. Quit Claude Desktop completely
2. Start Claude Desktop again
3. The weather forecast tools should now be available

## Verify It's Working

In Claude Desktop, try asking:

- "What's the weather forecast for the next 5 days?"
- "Get current weather"
- "Show weather for London"
- "Are there any weather alerts?"

Claude should use the MCP tools to fetch data from your Weather API.

## Troubleshooting

### MCP Server Not Showing Up in Claude

1. **Check the path** in claude_desktop_config.json is correct and uses absolute path
2. **Verify the API is running**: Open http://127.0.0.1:3000/docs in your browser
3. **Check Claude Desktop logs** (usually in AppData or Application Support folder)
4. **Restart Claude Desktop** after any config changes

### Connection Errors

1. Make sure Weather Forecast API is running:
   ```bash
   curl http://127.0.0.1:3000/api/forecast/health
   ```

2. Check the WEATHER_API_URL in your config matches where the API is running

3. Run the test script:
   ```bash
   cd WeatherForecastMCP
   node test-mcp.js
   ```

### Build Errors

If you get TypeScript errors:
```bash
npm install
npm run build
```

## Architecture

```
┌─────────────────┐
│  Claude Desktop │
└────────┬────────┘
         │ MCP Protocol
         │
┌────────▼────────┐
│   MCP Server    │
│  (Node.js/TS)   │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Weather API    │
│   (FastAPI)     │
└─────────────────┘
```

## Available MCP Tools

1. **get_weather_forecast** - Get forecast for X days
2. **get_current_weather** - Get current weather
3. **get_city_forecast** - Get forecast for a city
4. **get_detailed_forecast** - Get detailed forecast for a date
5. **get_detailed_forecasts** - Get detailed multi-day forecasts
6. **get_weather_alerts** - Get active weather alerts
7. **get_weather_statistics** - Get weather statistics
8. **create_custom_forecast_request** - Custom forecast request
9. **check_weather_api_health** - Check API health

## Need Help?

- Check README.md for detailed documentation
- View test-mcp.js for example API calls
- See claude_desktop_config_example.json for config reference
