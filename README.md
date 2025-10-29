# Weather Forecast API Integration Suite

A complete end-to-end weather forecast system with three integration layers: FastAPI backend, MCP Server for Claude Desktop, and n8n AI Agent integration.

![Architecture](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white)

## 🎯 Overview

This project provides multiple ways to access weather forecast data:

1. **Weather Forecast API** (FastAPI) - RESTful API with Swagger UI
2. **MCP Server** (Model Context Protocol) - Integration with Claude Desktop
3. **n8n AI Agent** - Workflow automation with AI tools (Direct API or MCP Bridge)

## 🏗️ Architecture

### Option 1: Direct API (Default - Simplest)
```
┌──────────────────────────────────────────────────────────┐
│              Client Applications                          │
├─────────────┬──────────────────┬─────────────────────────┤
│             │                  │                          │
│  Claude     │   n8n AI Agent   │   Direct API            │
│  Desktop    │   + Ollama       │   Consumers             │
│             │   (Direct)       │                          │
└─────┬───────┴────────┬─────────┴────────┬───────────────┘
      │                │                   │
      │ MCP stdio      │ HTTP              │ HTTP
      │                │                   │
┌─────▼──────┐        │                   │
│            │        │                   │
│ MCP Server │        │                   │
│ (Node.js)  │        │                   │
│            │        │                   │
└─────┬──────┘        │                   │
      │                │                   │
      └────────────────┴───────────────────┘
                       │
              ┌────────▼────────┐
              │                 │
              │  Weather API    │
              │   (FastAPI)     │
              │   Port: 3000    │
              │                 │
              └─────────────────┘
```

### Option 2: MCP Bridge (Optional - Unified Tools)
```
┌──────────────────────────────────────────────────────────┐
│              Client Applications                          │
├─────────────┬──────────────────┬─────────────────────────┤
│             │                  │                          │
│  Claude     │  n8n AI Agent    │   Direct API            │
│  Desktop    │  + Ollama        │   Consumers             │
│             │  (MCP Bridge)    │                          │
└─────┬───────┴────────┬─────────┴────────┬───────────────┘
      │                │                   │
      │ MCP stdio      │ HTTP              │ HTTP
      │                │                   │
┌─────▼──────┐  ┌─────▼────────┐         │
│            │  │                │         │
│ MCP Server │  │  MCP Bridge    │         │
│ (Node.js)  │  │  (Express.js)  │         │
│            │  │  Port: 9000    │         │
└─────┬──────┘  └─────┬──────────┘         │
      │                │ MCP stdio          │
      │         ┌──────▼──────┐            │
      │         │             │            │
      │         │ MCP Server  │            │
      │         │ (Node.js)   │            │
      │         │             │            │
      │         └──────┬──────┘            │
      │                │                   │
      └────────────────┴───────────────────┘
                       │
              ┌────────▼────────┐
              │                 │
              │  Weather API    │
              │   (FastAPI)     │
              │   Port: 3000    │
              │                 │
              └─────────────────┘
```

## 📁 Project Structure

```
mcp-poc/
├── WeatherForecastFastAPI/      # Core Weather API
│   ├── main.py                  # FastAPI application
│   ├── models.py                # Pydantic models
│   ├── service.py               # Business logic
│   └── requirements.txt
│
├── WeatherForecastMCP/          # MCP Server for Claude
│   ├── src/index.ts            # MCP implementation
│   ├── dist/index.js           # Compiled
│   └── package.json
│
└── WeatherForecastN8N/          # n8n Integration
    ├── src/mcp-bridge.ts       # MCP Bridge (optional)
    ├── dist/mcp-bridge.js      # Compiled
    ├── weather-ai-agent-chat-workflow.json      # Direct API workflow (default)
    ├── weather-mcp-direct-workflow.json         # MCP Bridge workflow
    ├── MCP_INTEGRATION.md      # Integration guide
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- n8n (optional)
- Ollama (optional, for local AI)

### 1. Weather Forecast API

```bash
cd WeatherForecastFastAPI
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 3000
```

**Access**:
- API: http://127.0.0.1:3000
- Swagger UI: http://127.0.0.1:3000/docs

### 2. MCP Server (Claude Desktop)

```bash
cd WeatherForecastMCP
npm install
npm run build
```

**Configuration**: See `WeatherForecastMCP/SETUP.md`

### 3. n8n Integration

#### Option A: Direct API (Default - Recommended)

Just start the Weather API and import the workflow:

```bash
# Weather API must be running on port 3000
# Import: weather-ai-agent-chat-workflow.json
```

**No additional services needed!**

#### Option B: MCP Bridge (Optional)

For unified tools with Claude Desktop:

```bash
cd WeatherForecastN8N
npm install
npm run build
npm start
```

**MCP Bridge**: http://localhost:9000
**Import workflow**: `weather-mcp-direct-workflow.json`

**See**: `WeatherForecastN8N/MCP_INTEGRATION.md` for details

## 🎨 Features

### Weather Forecast API

- ✅ 10 REST API endpoints
- ✅ Automatic Swagger/OpenAPI documentation
- ✅ No authentication (demo/development)
- ✅ CORS enabled
- ✅ Rich weather data models
- ✅ Pydantic validation

### MCP Server

- ✅ 9 MCP tools for Claude Desktop
- ✅ Type-safe TypeScript implementation
- ✅ Automatic error handling
- ✅ Full API coverage
- ✅ Tested and verified

### n8n AI Agent

- ✅ Two integration options (Direct API & MCP Bridge)
- ✅ Pre-configured n8n workflows
- ✅ Ollama Llama 3.2 integration
- ✅ 6 weather tools
- ✅ Chat interface ready
- ✅ No OpenAI API key required
- ✅ MCP Bridge for cross-platform consistency (optional)

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/forecast` | GET | Get multi-day forecast |
| `/api/forecast/current` | GET | Get current weather |
| `/api/forecast/city/{city}` | GET | Get city forecast |
| `/api/forecast/detailed` | GET | Get detailed forecast |
| `/api/forecast/detailed/multi` | GET | Get detailed multi-day |
| `/api/forecast/alerts` | GET | Get weather alerts |
| `/api/forecast/statistics` | GET | Get weather statistics |
| `/api/forecast/request` | POST | Custom forecast request |
| `/api/forecast/health` | GET | Health check |

## 🛠️ Technologies

### Backend
- **Python 3.14**
- **FastAPI 0.120.2**
- **Uvicorn 0.38.0**
- **Pydantic 2.12.3**

### MCP Server
- **TypeScript 5.5.4**
- **@modelcontextprotocol/sdk 1.0.4**
- **Axios 1.7.2**

### n8n Integration
- **Express.js 4.18.2**
- **Ollama** (Llama 3.2)
- **TypeScript 5.5.4**

## 📖 Documentation

Each component has detailed documentation:

- **Weather API**: `WeatherForecastFastAPI/README.md`
- **MCP Server**: `WeatherForecastMCP/README.md` + `SETUP.md`
- **n8n Integration**: `WeatherForecastN8N/README.md` + `MCP_INTEGRATION.md` + `SETUP.md` + `OLLAMA_SETUP.md` + `TROUBLESHOOTING.md`

## 🎯 Use Cases

### 1. Claude Desktop Integration

Use weather tools directly in Claude Desktop conversations through MCP.

**Setup**: Add to `claude_desktop_config.json`
```json
{
  "mcpServers": {
    "weather-forecast": {
      "command": "node",
      "args": ["path/to/WeatherForecastMCP/dist/index.js"],
      "env": {"WEATHER_API_URL": "http://127.0.0.1:3000"}
    }
  }
}
```

### 2. n8n AI Agent Workflow

Create automated weather workflows with AI-powered tool selection.

**Default Setup** (Direct API):
- Import `weather-ai-agent-chat-workflow.json` into n8n
- Ensure Weather API is running on port 3000
- No additional services required

**Advanced Setup** (MCP Bridge):
- Import `weather-mcp-direct-workflow.json` into n8n
- Start MCP Bridge: `npm start` in WeatherForecastN8N
- Provides unified tools with Claude Desktop

### 3. Direct API Access

Integrate weather data directly into your applications.

**Example**:
```bash
curl "http://127.0.0.1:3000/api/forecast?days=5"
```

## 🧪 Testing

### Test Weather API
```bash
curl http://127.0.0.1:3000/api/forecast/health
curl "http://127.0.0.1:3000/api/forecast?days=3"
```

### Test MCP Bridge (Optional)
```bash
curl http://localhost:9000/health
curl "http://localhost:9000/tools/forecast?days=3"
```

### Test MCP Server
```bash
cd WeatherForecastMCP
node test-mcp.js
```

## 🔧 Configuration

### Environment Variables

**Weather API**:
- No configuration required (runs on port 3000)

**MCP Server**:
```bash
export WEATHER_API_URL=http://127.0.0.1:3000
```

**MCP Bridge** (optional):
```bash
export MCP_BRIDGE_PORT=9000
```

## 🐛 Troubleshooting

See detailed troubleshooting guides:
- `WeatherForecastN8N/TROUBLESHOOTING.md`
- `WeatherForecastN8N/MCP_INTEGRATION.md`
- `WeatherForecastMCP/SETUP.md`

### Common Issues

**Port conflicts**: Change ports in configuration
**Ollama not found**: Install from https://ollama.com
**n8n schema errors**: Use updated workflow files (weather-ai-agent-chat-workflow.json)
**MCP Bridge not needed**: Use direct API workflow for simpler setup

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - Free to use, modify, and distribute

## 🎉 Acknowledgments

- FastAPI for the amazing Python web framework
- Model Context Protocol for Claude integration
- n8n for workflow automation
- Ollama for local AI models

## 📞 Support

For issues or questions:
1. Check documentation in each component folder
2. Review troubleshooting guides
3. Open an issue on GitHub

---

**Built with ❤️ using FastAPI, TypeScript, and n8n**

## 🚦 Status

- ✅ Weather API: Production ready
- ✅ MCP Server: Stable
- ✅ n8n Integration: Stable
- ✅ Documentation: Complete
- ✅ Tests: Passing

**Last Updated**: 2025-10-29
