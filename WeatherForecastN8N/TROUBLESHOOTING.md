# n8n Workflow Troubleshooting Guide

## Common Issues and Solutions

### ✅ FIXED: "Received tool input did not match expected schema"

**Problem**: AI Agent was passing parameters but tools couldn't extract them properly.

**Solution**: Updated all tools to use `$fromAI()` function to extract parameters from AI input.

**What was changed:**
- ❌ Before: `"url": "http://localhost:5000/tools/forecast", "queryParameters": {...}`
- ✅ After: `"url": "=http://localhost:5000/tools/forecast?days={{ $fromAI('days', '', 5) }}"`

This allows the tool to properly extract parameters that the AI Agent provides.

---

## Current Workflow Status

### ✅ Fixed Issues
1. Tool parameter extraction using `$fromAI()`
2. Chat Trigger for proper conversation flow
3. Ollama Llama 3.2 integration configured
4. System message for weather assistant role

### Workflow: `weather-ai-agent-chat-workflow.json`

**Components:**
- Chat Trigger ✅
- AI Agent ✅
- Ollama Llama 3.2 ✅
- 6 Weather Tools ✅

---

## How to Test

### 1. Verify Services

```bash
# Weather API (Port 3000)
curl http://127.0.0.1:3000/api/forecast/health

# HTTP Wrapper (Port 5000)
curl http://localhost:5000/tools

# Ollama (Port 11434)
ollama list
```

### 2. Import Workflow

1. Open n8n: `http://localhost:5678`
2. Import `weather-ai-agent-chat-workflow.json`
3. Activate workflow

### 3. Test Chat

**Simple queries to test:**
- "What's the weather?" (uses get_weather_forecast)
- "Current weather" (uses get_current_weather)
- "Weather in London" (uses get_city_forecast)
- "Any weather alerts?" (uses get_weather_alerts)
- "Weather statistics" (uses get_weather_statistics)

---

## Troubleshooting Steps

### Issue: "No prompt specified"

**Cause**: AI Agent node missing text parameter.

**Solution**: Already fixed in current workflow. The AI Agent has:
```json
"text": "={{ $json.chatInput }}"
```

---

### Issue: "Tool input schema error"

**Cause**: Tools not extracting AI parameters properly.

**Solution**: All tools now use `$fromAI()` function:
```javascript
// Example for forecast tool
url: "=http://localhost:5000/tools/forecast?days={{ $fromAI('days', '', 5) }}"
```

The `$fromAI()` function:
- 1st parameter: name of the parameter AI is passing
- 2nd parameter: JSON path (empty for direct access)
- 3rd parameter: default value if not provided

---

### Issue: Ollama Not Responding

**Symptoms:**
- Workflow hangs
- No response from AI
- Timeout errors

**Solutions:**

1. **Check if Ollama is running:**
   ```bash
   ollama list
   ```

2. **Start Ollama if needed:**
   ```bash
   ollama serve
   ```

3. **Pull Llama 3.2 model:**
   ```bash
   ollama pull llama3.2:latest
   ```

4. **Test Ollama directly:**
   ```bash
   ollama run llama3.2 "Hello"
   ```

5. **Verify Ollama URL in workflow:**
   - Should be: `http://localhost:11434`
   - Check "Ollama Llama 3.2" node settings

---

### Issue: HTTP Wrapper Connection Errors

**Symptoms:**
- Tools return errors
- "Connection refused" messages
- Empty responses

**Solutions:**

1. **Check HTTP Wrapper is running:**
   ```bash
   curl http://localhost:5000/tools
   ```

2. **Restart HTTP Wrapper:**
   ```bash
   cd WeatherForecastN8N
   npm start
   ```

3. **Verify URL in tool nodes:**
   - All tools should use: `http://localhost:5000`
   - Check each tool's URL parameter

4. **Test endpoints directly:**
   ```bash
   curl "http://localhost:5000/tools/forecast?days=3"
   curl "http://localhost:5000/tools/current"
   ```

---

### Issue: Weather API Not Responding

**Symptoms:**
- HTTP Wrapper works but no data
- 404 or 500 errors
- Empty weather responses

**Solutions:**

1. **Check Weather API:**
   ```bash
   curl http://127.0.0.1:3000/api/forecast/health
   ```

2. **Restart Weather API:**
   ```bash
   cd WeatherForecastFastAPI
   uvicorn main:app --reload --host 127.0.0.1 --port 3000
   ```

3. **Test API directly:**
   - Open: http://127.0.0.1:3000/docs
   - Try endpoints in Swagger UI

---

### Issue: AI Not Using Tools

**Symptoms:**
- AI responds without calling tools
- Generic responses
- No tool execution logs

**Solutions:**

1. **Check tool descriptions:**
   - Tools have clear, descriptive descriptions
   - Already optimized in current workflow

2. **Verify tool connections:**
   - Each tool should connect to AI Agent
   - Check connections tab in n8n

3. **Test with explicit queries:**
   - Instead of: "How's the weather?"
   - Try: "Get the weather forecast for 5 days"

4. **Check Ollama model:**
   - llama3.2:latest should be pulled
   - Try with different temperature settings

---

### Issue: Slow Responses

**Symptoms:**
- Long wait times
- Timeouts
- Incomplete responses

**Solutions:**

1. **Use smaller Ollama model:**
   ```bash
   ollama pull llama3.2:1b
   ```
   Update workflow to use `llama3.2:1b`

2. **Reduce temperature:**
   - Lower temperature = faster responses
   - Try 0.3 instead of 0.7

3. **Check system resources:**
   - Close other applications
   - Ensure adequate RAM available

4. **Enable GPU acceleration:**
   - Ollama automatically uses GPU if available
   - Check with: `ollama ps`

---

## Parameter Extraction Reference

### How `$fromAI()` Works

```javascript
// Format: $fromAI('parameterName', 'jsonPath', defaultValue)

// Example 1: Extract 'days' parameter, default to 5
$fromAI('days', '', 5)

// Example 2: Extract 'city' parameter, default to empty string
$fromAI('city', '', '')

// Example 3: Extract 'city' parameter, default to 'London'
$fromAI('city', '', 'London')
```

### Tool URL Examples

```javascript
// Simple parameter
url: "=http://localhost:5000/tools/forecast?days={{ $fromAI('days', '', 5) }}"

// Multiple parameters
url: "=http://localhost:5000/tools/city-forecast?city={{ $fromAI('city', '', 'London') }}&days={{ $fromAI('days', '', 5) }}"

// Optional parameter (empty default)
url: "=http://localhost:5000/tools/current?city={{ $fromAI('city', '', '') }}"
```

---

## Verification Checklist

Use this checklist to verify everything is working:

### Services Status
- [ ] Weather API running on port 3000
- [ ] HTTP Wrapper running on port 5000
- [ ] Ollama running on port 11434
- [ ] n8n running on port 5678
- [ ] Llama 3.2 model pulled

### Workflow Configuration
- [ ] Workflow imported: `weather-ai-agent-chat-workflow.json`
- [ ] Chat Trigger node present
- [ ] AI Agent node configured
- [ ] Ollama node pointing to localhost:11434
- [ ] All 6 tools connected to AI Agent
- [ ] All tools using `$fromAI()` for parameters

### Testing
- [ ] Can open chat interface
- [ ] AI responds to simple queries
- [ ] Tools are being called (check execution logs)
- [ ] Weather data is returned
- [ ] Responses are formatted correctly

---

## Debug Mode

### Enable n8n Debug Logging

1. Set environment variable:
   ```bash
   export N8N_LOG_LEVEL=debug
   ```

2. Restart n8n

3. Check logs for tool execution details

### Check Tool Execution

In n8n:
1. Execute workflow
2. Click on each node
3. View "Input" and "Output" tabs
4. Check for errors or unexpected data

---

## Quick Fixes

### Reset Everything

```bash
# 1. Stop all services
# Ctrl+C in each terminal

# 2. Restart Weather API
cd WeatherForecastFastAPI
uvicorn main:app --reload --host 127.0.0.1 --port 3000

# 3. Restart HTTP Wrapper
cd WeatherForecastN8N
npm start

# 4. Restart Ollama
ollama serve

# 5. Reimport workflow in n8n
# Delete old workflow, import fresh copy
```

### Test Each Layer

```bash
# Layer 1: Weather API
curl http://127.0.0.1:3000/api/forecast/health

# Layer 2: HTTP Wrapper
curl http://localhost:5000/tools/health

# Layer 3: Ollama
ollama run llama3.2 "test"

# Layer 4: n8n (manual test in UI)
```

---

## Getting Help

### Check Logs

**Weather API:**
- View terminal where FastAPI is running
- Check for errors or warnings

**HTTP Wrapper:**
- View terminal where npm start is running
- Check for connection errors

**Ollama:**
- Check Ollama logs
- Run: `ollama logs` (if available)

**n8n:**
- Check browser console (F12)
- Check n8n execution logs

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Connection refused" | Service not running | Start the service |
| "Tool input schema error" | Parameter extraction issue | Use `$fromAI()` function |
| "No prompt specified" | AI Agent missing text | Add text parameter |
| "Model not found" | Ollama model not pulled | `ollama pull llama3.2` |
| "Timeout" | Slow response/no response | Check Ollama, reduce temperature |

---

## Support Resources

- **n8n Docs**: https://docs.n8n.io
- **Ollama Docs**: https://ollama.com/docs
- **Weather API**: See `../WeatherForecastFastAPI/README.md`
- **HTTP Wrapper**: See `README.md` in this folder

---

## Summary

✅ **All issues fixed** in `weather-ai-agent-chat-workflow.json`
✅ **Tools properly configured** with `$fromAI()` parameter extraction
✅ **Ollama Llama 3.2** configured and ready
✅ **Complete troubleshooting guide** for common issues

**Import the workflow and start chatting!** 🎉
