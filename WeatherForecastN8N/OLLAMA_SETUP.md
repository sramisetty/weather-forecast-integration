# Weather Forecast n8n with Ollama Llama 3.2

## Overview

This workflow uses **Ollama with Llama 3.2** instead of OpenAI, providing a completely local and free AI solution for your weather assistant.

## Prerequisites

### 1. Install Ollama

**Windows:**
- Download from: https://ollama.com/download
- Run the installer
- Ollama will start automatically

**Mac:**
```bash
brew install ollama
ollama serve
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

### 2. Pull Llama 3.2 Model

```bash
ollama pull llama3.2:latest
```

This will download the Llama 3.2 model (approximately 2GB).

### 3. Verify Ollama is Running

```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Or test with a simple prompt
ollama run llama3.2 "Hello, how are you?"
```

## Workflow Files

Two workflow options available:

### 1. **weather-ai-agent-chat-workflow.json** (Recommended)
- ✅ Uses Ollama Llama 3.2
- ✅ Chat Trigger for conversation
- ✅ 6 weather tools
- ✅ No API keys required
- ✅ Runs completely locally

### 2. **weather-ai-agent-workflow.json** (Original)
- Uses OpenAI GPT-4
- Requires OpenAI API key
- Still available if you prefer OpenAI

## Setup Instructions

### Step 1: Ensure Services Are Running

Check all three services:

```bash
# 1. Weather API (Port 3000)
curl http://127.0.0.1:3000/api/forecast/health

# 2. HTTP Wrapper (Port 5000)
curl http://localhost:5000/tools

# 3. Ollama (Port 11434)
curl http://localhost:11434/api/tags
```

### Step 2: Import Workflow to n8n

1. Open n8n: `http://localhost:5678`
2. Click "Workflows" → "Import from File"
3. Select `weather-ai-agent-chat-workflow.json`
4. Click "Import"

### Step 3: Activate the Workflow

1. In n8n, click "Active" toggle in top right
2. The workflow is now ready to use

### Step 4: Test the Chat

1. Click on "When chat message received" node
2. Click "Open chat" or use the webhook URL
3. Send a test message: "What's the weather forecast?"

## Architecture

```
┌──────────────────┐
│   User Query     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  n8n Chat UI     │
│  (Chat Trigger)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   AI Agent       │
│  (Orchestrator)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Ollama Llama 3.2 │  ← Local AI Model
│ localhost:11434  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  6 Weather Tools │  ← HTTP Request Tools
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  HTTP Wrapper    │
│ localhost:5000   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Weather API     │
│ localhost:3000   │
└──────────────────┘
```

## Configuration

### Ollama Settings

The workflow is configured with:
- **Model**: `llama3.2:latest`
- **Base URL**: `http://localhost:11434`
- **Temperature**: `0.7` (balance between creativity and accuracy)

### Customizing Model Settings

Edit the "Ollama Llama 3.2" node in n8n:

**Temperature** (0.0 - 1.0):
- `0.0` - Very deterministic, consistent responses
- `0.5` - Balanced
- `0.7` - Default, good for conversations
- `1.0` - More creative, varied responses

**Other Models**:
You can use different Ollama models:
- `llama3.2:latest` (default)
- `llama3.1:8b`
- `llama3:70b` (requires more RAM)
- `mistral:latest`
- `codellama:latest`

To change:
```bash
# Pull different model
ollama pull mistral:latest

# Update in n8n node parameters
# Change "model" to "mistral:latest"
```

## Example Conversations

### Example 1: Simple Forecast
```
User: What's the weather forecast for the next 5 days?

AI: I'll check the weather forecast for you.
[Uses get_weather_forecast tool]

Based on the forecast, here's what to expect over the next 5 days:

Day 1: 22°C (72°F) - Sunny, 65% humidity
Day 2: 19°C (66°F) - Partly cloudy, 70% humidity
Day 3: 17°C (63°F) - Cloudy, 75% humidity
...
```

### Example 2: City-Specific Query
```
User: How's the weather in London?

AI: Let me check the current weather in London for you.
[Uses get_current_weather tool]

The current weather in London is:
- Temperature: 15°C (59°F)
- Conditions: Rainy
- Humidity: 82%
- Wind: 12 km/h from SW
```

### Example 3: Weather Alerts
```
User: Are there any weather alerts?

AI: Let me check for active weather alerts.
[Uses get_weather_alerts tool]

There are currently 2 active weather alerts:
1. Thunderstorm Warning - Moderate severity
   Valid from 2:00 PM to 6:00 PM today
2. High Wind Advisory - Low severity
   Valid until midnight
```

## Advantages of Ollama

### ✅ Benefits

1. **Free**: No API costs
2. **Private**: Data stays on your machine
3. **Fast**: No network latency
4. **Unlimited**: No rate limits
5. **Offline**: Works without internet

### ⚠️ Considerations

1. **Hardware**: Requires decent CPU/GPU
2. **RAM**: ~8GB recommended for llama3.2
3. **Storage**: Models are 2-7GB each
4. **Performance**: Slower than cloud APIs on older hardware

## Troubleshooting

### Ollama Not Responding

**Check if Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

**Start Ollama:**
```bash
# Windows: Should auto-start, check system tray
# Mac/Linux:
ollama serve
```

### Model Not Found

**Pull the model:**
```bash
ollama pull llama3.2:latest
```

**List available models:**
```bash
ollama list
```

### n8n Can't Connect to Ollama

1. Verify Ollama URL in node: `http://localhost:11434`
2. Check firewall isn't blocking port 11434
3. Test Ollama directly:
   ```bash
   ollama run llama3.2 "test"
   ```

### Slow Responses

**Options to improve speed:**

1. **Use smaller model:**
   ```bash
   ollama pull llama3.2:1b  # Smaller, faster
   ```

2. **Enable GPU acceleration** (if available):
   - Ollama automatically uses GPU if available
   - Check with: `ollama ps`

3. **Reduce temperature**:
   - Lower temperature = faster, more deterministic

### Tools Not Working

**Check HTTP Wrapper:**
```bash
curl http://localhost:5000/tools
```

**Check Weather API:**
```bash
curl http://127.0.0.1:3000/api/forecast/health
```

## Performance Tips

### Optimize for Speed

1. **Keep model in memory:**
   ```bash
   # Ollama keeps recently used models loaded
   # Use it regularly to avoid reload delays
   ```

2. **Use appropriate model size:**
   - `llama3.2:1b` - Fastest, less capable
   - `llama3.2:3b` - Balanced
   - `llama3.2:latest` (7b) - Most capable

3. **Adjust context length:**
   - Shorter contexts = faster responses
   - Set in Ollama node options if needed

### Hardware Recommendations

| Hardware | Recommended Model | Expected Performance |
|----------|-------------------|---------------------|
| 8GB RAM, CPU | llama3.2:1b | 2-5 sec per response |
| 16GB RAM, CPU | llama3.2:3b | 3-8 sec per response |
| 16GB+ RAM, GPU | llama3.2:latest | 1-3 sec per response |
| 32GB+ RAM, GPU | llama3.1:70b | 2-5 sec per response |

## Comparing to OpenAI

| Feature | Ollama Llama 3.2 | OpenAI GPT-4 |
|---------|------------------|--------------|
| Cost | Free | ~$0.03 per 1K tokens |
| Privacy | Fully private | Data sent to OpenAI |
| Speed | Depends on hardware | Fast (cloud) |
| Availability | Requires local setup | Always available |
| Capabilities | Good for most tasks | Superior |
| Internet | Not required | Required |

## Switching Between Models

### To Use OpenAI Instead

1. Import `weather-ai-agent-workflow.json` (original)
2. Configure OpenAI API key in "OpenAI Chat Model" node
3. Use that workflow instead

### To Use Different Ollama Model

1. Pull the model: `ollama pull mistral:latest`
2. Edit "Ollama Llama 3.2" node in workflow
3. Change model parameter to `mistral:latest`
4. Save and test

## Running Multiple Ollama Models

You can run different models for different workflows:

```bash
# Pull multiple models
ollama pull llama3.2:latest
ollama pull mistral:latest
ollama pull codellama:latest

# They can be used in different n8n workflows
# Ollama will load them on-demand
```

## Additional Resources

- **Ollama**: https://ollama.com
- **Ollama Models**: https://ollama.com/library
- **n8n Ollama Docs**: https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatollama/
- **Llama 3.2**: https://ollama.com/library/llama3.2

## Summary

✅ **weather-ai-agent-chat-workflow.json** configured with Ollama Llama 3.2
✅ **No API keys required** - completely free and local
✅ **6 weather tools** connected and ready
✅ **Privacy-focused** - all processing on your machine

**Import the workflow, start Ollama, and chat with your weather assistant!** 🎉
