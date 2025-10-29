# Quick Setup Guide - n8n AI Agent Integration

## Prerequisites Checklist

- ✅ Node.js installed
- ✅ Weather Forecast API running on port 3000
- ✅ n8n installed (self-hosted or cloud)
- ⬜ OpenAI API key

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd WeatherForecastN8N
npm install
```

### 2. Build the HTTP Wrapper

```bash
npm run build
```

### 3. Start the HTTP Wrapper

```bash
npm start
```

✅ You should see the server running on `http://localhost:5000`

### 4. Test the HTTP Wrapper

Open a new terminal and test:

```bash
curl http://localhost:5000/tools
```

Expected response: List of available tools

### 5. Import Workflow to n8n

1. Open n8n (usually `http://localhost:5678`)
2. Click "Workflows" menu
3. Click "Import from File"
4. Select `weather-ai-agent-workflow.json`
5. Click "Import"

### 6. Configure OpenAI in n8n

1. In the imported workflow, click the "OpenAI Chat Model" node
2. Click "Create New Credential"
3. Enter your OpenAI API key
4. Click "Save"
5. Close the node

### 7. Test the Workflow

1. Click "Execute Workflow" button
2. In the "When chat message received" node, enter a test message:
   - "What's the weather forecast for the next 5 days?"
3. Click "Execute Node"
4. Check the AI Agent output

## Services Overview

Make sure these are running:

| Service | Port | Status Command |
|---------|------|----------------|
| Weather API | 3000 | `curl http://127.0.0.1:3000/api/forecast/health` |
| HTTP Wrapper | 5000 | `curl http://localhost:5000/tools` |
| n8n | 5678 | Open `http://localhost:5678` |

## Quick Test Commands

```bash
# Test Weather API
curl http://127.0.0.1:3000/api/forecast/health

# Test HTTP Wrapper
curl http://localhost:5000/tools

# Test forecast endpoint
curl "http://localhost:5000/tools/forecast?days=3"

# Test current weather
curl "http://localhost:5000/tools/current?city=London"
```

## Example AI Agent Queries

Once everything is set up, try these queries in n8n:

- "What's the weather forecast for the next 5 days?"
- "Show me current weather in London"
- "Get weather forecast for Tokyo for 3 days"
- "Are there any weather alerts?"
- "What are the weather statistics for the past week?"

## Troubleshooting

### Port Already in Use

If port 5000 is busy:
```bash
PORT=8080 npm start
```

Then update n8n workflow tool URLs to `http://localhost:8080`

### n8n Can't Connect

1. Check HTTP wrapper is running: `curl http://localhost:5000/tools`
2. In n8n, verify tool URLs are `http://localhost:5000/tools/*`
3. Restart n8n after importing workflow

### Weather API Not Responding

Start the Weather API:
```bash
cd ../WeatherForecastFastAPI
uvicorn main:app --reload --host 127.0.0.1 --port 3000
```

### OpenAI Errors

- Verify API key is correct
- Check OpenAI account has credits
- Try using gpt-3.5-turbo instead of gpt-4

## Architecture

```
User Query
    ↓
n8n AI Agent (Port 5678)
    ↓
HTTP Wrapper (Port 5000)
    ↓
Weather API (Port 3000)
    ↓
Response
```

## Next Steps

1. ✅ All services running
2. ✅ Workflow imported
3. ✅ OpenAI configured
4. ✅ Test query works
5. 🎉 Start building your weather assistant!

## Advanced Configuration

### Custom System Prompt

In n8n AI Agent node, add custom prompt:
```
You are a helpful weather assistant. When users ask about weather,
use the available tools to provide accurate, detailed information.
Always include temperature in both Celsius and Fahrenheit.
```

### Add More Tools

1. Add endpoint to `src/http-wrapper.ts`
2. Rebuild: `npm run build`
3. Restart: `npm start`
4. In n8n, add new "HTTP Request" tool node
5. Configure endpoint and connect to AI Agent

### Error Handling

HTTP wrapper includes error handling. All errors return:
```json
{
  "success": false,
  "error": "error message"
}
```

## Support

- HTTP Wrapper docs: See README.md
- Weather API docs: See `../WeatherForecastFastAPI/README.md`
- n8n docs: https://docs.n8n.io

---

**Setup Complete!** Your n8n AI Agent is ready to use weather tools! 🎉
