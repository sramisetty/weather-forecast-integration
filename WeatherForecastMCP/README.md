# Weather Forecast MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to the Weather Forecast API.

## Overview

This MCP server exposes weather forecast functionality through standardized tools that can be used by AI assistants like Claude. It connects to the Weather Forecast FastAPI backend and provides 9 different weather-related tools.

## Features

- **9 Weather Tools** for AI assistants
- **Type-safe TypeScript** implementation
- **Error handling** with detailed messages
- **Configurable API endpoint**
- **Full API coverage** of the Weather Forecast API

## Available Tools

### 1. `get_weather_forecast`
Get weather forecast for a specified number of days (1-30).

**Parameters:**
- `days` (optional): Number of days (default: 5)

### 2. `get_current_weather`
Get current weather conditions for a specific city or default location.

**Parameters:**
- `city` (optional): City name

### 3. `get_city_forecast`
Get weather forecast for a specific city.

**Parameters:**
- `city` (required): City name
- `days` (optional): Number of days (default: 5)

### 4. `get_detailed_forecast`
Get detailed weather forecast for a specific date.

**Parameters:**
- `date` (required): ISO format date (YYYY-MM-DDTHH:MM:SS)
- `city` (optional): City name

### 5. `get_detailed_forecasts`
Get detailed weather forecasts for multiple days.

**Parameters:**
- `days` (optional): Number of days (default: 5)

### 6. `get_weather_alerts`
Get active weather alerts for a specific area.

**Parameters:**
- `city` (optional): City name

### 7. `get_weather_statistics`
Get weather statistics for a specified period.

**Parameters:**
- `days` (optional): Number of days to analyze (default: 7)

### 8. `create_custom_forecast_request`
Create a custom weather forecast request.

**Parameters:**
- `city` (optional): City name
- `days` (optional): Number of days (default: 5)

### 9. `check_weather_api_health`
Check the health status of the Weather Forecast API service.

**Parameters:** None

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Weather Forecast FastAPI running (default: http://127.0.0.1:3000)

## Installation

1. **Navigate to the MCP server directory:**
   ```bash
   cd WeatherForecastMCP
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Watch Mode (auto-rebuild)
```bash
npm run watch
```

## Configuration

### Environment Variables

- `WEATHER_API_URL`: URL of the Weather Forecast API (default: `http://127.0.0.1:3000`)

Set environment variable before running:

**Windows:**
```cmd
set WEATHER_API_URL=http://localhost:3000
npm start
```

**Linux/Mac:**
```bash
export WEATHER_API_URL=http://localhost:3000
npm start
```

## Integrating with Claude Desktop

To use this MCP server with Claude Desktop, add it to your Claude configuration file:

### Windows
Edit `%APPDATA%\Claude\claude_desktop_config.json`:

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

### Mac
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "weather-forecast": {
      "command": "node",
      "args": [
        "/Users/yourusername/Work/mcp-poc/WeatherForecastMCP/dist/index.js"
      ],
      "env": {
        "WEATHER_API_URL": "http://127.0.0.1:3000"
      }
    }
  }
}
```

### Linux
Edit `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "weather-forecast": {
      "command": "node",
      "args": [
        "/home/yourusername/Work/mcp-poc/WeatherForecastMCP/dist/index.js"
      ],
      "env": {
        "WEATHER_API_URL": "http://127.0.0.1:3000"
      }
    }
  }
}
```

After adding the configuration:
1. Save the file
2. Restart Claude Desktop
3. The weather forecast tools will be available to Claude

## Usage Example

Once configured, you can ask Claude:

- "What's the weather forecast for the next 5 days?"
- "Get current weather for London"
- "Show me detailed weather for New York for the next 3 days"
- "Are there any weather alerts?"
- "Get weather statistics for the past week"

Claude will use the appropriate MCP tools to fetch the data from your Weather Forecast API.

## Project Structure

```
WeatherForecastMCP/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Development

### Building
```bash
npm run build
```

### Type Checking
TypeScript will automatically check types during build.

### Adding New Tools

1. Add the tool definition to the `TOOLS` array in `src/index.ts`
2. Add a new method to the `WeatherAPIClient` class if needed
3. Add a case in the switch statement in the `CallToolRequestSchema` handler
4. Rebuild: `npm run build`

## Troubleshooting

### MCP Server Won't Start
- Ensure Node.js is installed: `node --version`
- Check that dependencies are installed: `npm install`
- Build the project: `npm run build`
- Verify the Weather Forecast API is running

### Connection Errors
- Ensure the Weather Forecast API is running on the configured URL
- Check the `WEATHER_API_URL` environment variable
- Test the API directly: `curl http://127.0.0.1:3000/api/forecast/health`

### Claude Desktop Not Finding Tools
- Verify the configuration file path is correct
- Check that the path to `dist/index.js` is absolute and correct
- Restart Claude Desktop after configuration changes
- Check Claude Desktop logs for errors

## API Requirements

This MCP server requires the Weather Forecast FastAPI to be running. Ensure:
- The API is accessible at the configured URL
- All endpoints are responding without authentication
- The API returns JSON responses

## Technologies Used

- **TypeScript**: Type-safe development
- **@modelcontextprotocol/sdk**: MCP protocol implementation
- **Axios**: HTTP client for API requests
- **Node.js**: Runtime environment

## License

MIT License

## Support

For issues related to:
- **MCP Server**: Check this README and logs
- **Weather API**: See WeatherForecastFastAPI documentation
- **Claude Integration**: Refer to Claude Desktop documentation
