# n8n AI Agent Integration Guide

## Complete Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      User Query                         │
│              "What's the weather in London?"            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │      n8n AI Agent Workflow    │
         │    http://localhost:5678      │
         │                               │
         │  ┌─────────────────────────┐  │
         │  │   OpenAI Chat Model     │  │
         │  │      (gpt-4)            │  │
         │  └──────────┬──────────────┘  │
         │             │                  │
         │             ▼                  │
         │  ┌─────────────────────────┐  │
         │  │   6 Weather Tools       │  │
         │  │  - Forecast             │  │
         │  │  - Current Weather      │  │
         │  │  - City Forecast        │  │
         │  │  - Alerts               │  │
         │  │  - Statistics           │  │
         │  │  - Detailed Forecast    │  │
         │  └──────────┬──────────────┘  │
         └─────────────┼──────────────────┘
                       │ HTTP GET Requests
                       │
                       ▼
         ┌─────────────────────────────┐
         │   HTTP Wrapper Service      │
         │   http://localhost:5000     │
         │                             │
         │   Express.js + TypeScript   │
         │                             │
         │   Endpoints:                │
         │   /tools/forecast           │
         │   /tools/current            │
         │   /tools/city-forecast      │
         │   /tools/alerts             │
         │   /tools/statistics         │
         │   /tools/detailed-multi     │
         │   /tools/health             │
         └──────────┬──────────────────┘
                    │ HTTP REST API
                    │
                    ▼
         ┌─────────────────────────────┐
         │   Weather Forecast API      │
         │   http://127.0.0.1:3000     │
         │                             │
         │   FastAPI + Python          │
         │                             │
         │   10 API Endpoints          │
         │   Swagger UI: /docs         │
         └─────────────────────────────┘
```

## Component Details

### 1. n8n AI Agent (Port 5678)
- **Type**: Workflow automation + AI Agent
- **AI Model**: OpenAI GPT-4
- **Tools**: 6 HTTP Request tools
- **Input**: User queries
- **Output**: AI-generated responses with weather data

### 2. HTTP Wrapper (Port 5000)
- **Type**: Express.js REST API
- **Purpose**: Bridge between n8n and Weather API
- **Endpoints**: 8 tool endpoints
- **Format**: JSON responses with success/error handling
- **Technology**: TypeScript + Express + Axios

### 3. Weather API (Port 3000)
- **Type**: FastAPI REST API
- **Endpoints**: 10 weather operations
- **Data**: Temperature, humidity, wind, alerts, statistics
- **Technology**: Python + FastAPI + Pydantic

## Data Flow Example

### User Query: "What's the weather in London for 3 days?"

1. **n8n AI Agent receives query**
   - AI analyzes the query
   - Identifies need for city forecast tool
   - Parameters: `city=London`, `days=3`

2. **AI Agent calls HTTP Wrapper**
   ```
   GET http://localhost:5000/tools/city-forecast?city=London&days=3
   ```

3. **HTTP Wrapper processes request**
   - Validates parameters
   - Forwards to Weather API
   ```
   GET http://127.0.0.1:3000/api/forecast/city/London?days=3
   ```

4. **Weather API returns data**
   ```json
   [
     {
       "date": "2025-10-30T10:00:00",
       "temperature_c": 15,
       "temperature_f": 59,
       "summary": "Cloudy",
       "humidity": 75,
       ...
     },
     ...
   ]
   ```

5. **HTTP Wrapper formats response**
   ```json
   {
     "success": true,
     "data": [ /* weather data */ ]
   }
   ```

6. **AI Agent receives data**
   - Processes weather data
   - Generates human-readable response

7. **User receives response**
   ```
   "The weather in London for the next 3 days:
   - Day 1: 15°C (59°F), Cloudy, 75% humidity
   - Day 2: 17°C (63°F), Partly cloudy, 68% humidity
   - Day 3: 14°C (57°F), Rainy, 82% humidity"
   ```

## Tool Mapping

| n8n Tool | HTTP Endpoint | Weather API Endpoint | Description |
|----------|---------------|---------------------|-------------|
| Weather Forecast Tool | `/tools/forecast` | `/api/forecast` | Multi-day forecast |
| Current Weather Tool | `/tools/current` | `/api/forecast/current` | Current conditions |
| City Forecast Tool | `/tools/city-forecast` | `/api/forecast/city/{city}` | City-specific forecast |
| Weather Alerts Tool | `/tools/alerts` | `/api/forecast/alerts` | Active alerts |
| Weather Statistics Tool | `/tools/statistics` | `/api/forecast/statistics` | Weather stats |
| Detailed Forecast Tool | `/tools/detailed-multi` | `/api/forecast/detailed/multi` | Detailed forecast |

## Setup Checklist

### Phase 1: Weather API
- [ ] Weather API running on port 3000
- [ ] Test: `curl http://127.0.0.1:3000/api/forecast/health`
- [ ] Swagger UI accessible: http://127.0.0.1:3000/docs

### Phase 2: HTTP Wrapper
- [ ] Dependencies installed: `npm install`
- [ ] Built successfully: `npm run build`
- [ ] HTTP wrapper running on port 5000
- [ ] Test: `curl http://localhost:5000/tools`
- [ ] All endpoints responding

### Phase 3: n8n Integration
- [ ] n8n installed and running
- [ ] Workflow imported from `weather-ai-agent-workflow.json`
- [ ] OpenAI API key configured
- [ ] All tool nodes connected to AI Agent
- [ ] Test workflow executes successfully

## Testing the Integration

### 1. Test HTTP Wrapper

```bash
# List tools
curl http://localhost:5000/tools

# Test each tool
curl "http://localhost:5000/tools/forecast?days=3"
curl "http://localhost:5000/tools/current?city=London"
curl "http://localhost:5000/tools/city-forecast?city=Tokyo&days=2"
curl "http://localhost:5000/tools/alerts"
curl "http://localhost:5000/tools/statistics?days=7"
curl "http://localhost:5000/tools/health"
```

### 2. Test in n8n

Import workflow and test with these queries:

1. **Simple forecast**: "What's the weather for the next 5 days?"
2. **City query**: "Show me weather in Paris"
3. **Specific request**: "Get 3-day forecast for New York"
4. **Alerts**: "Are there any weather alerts?"
5. **Statistics**: "What are the weather statistics for last week?"

### 3. Verify AI Agent Tool Selection

The AI should automatically choose appropriate tools:

| User Query | Expected Tool | Reason |
|------------|--------------|--------|
| "Weather forecast" | Forecast Tool | General forecast request |
| "Current weather in London" | Current Weather Tool | Specific to current + city |
| "Tokyo weather for 3 days" | City Forecast Tool | City + duration specified |
| "Weather alerts" | Alerts Tool | Explicitly mentions alerts |
| "Weather stats" | Statistics Tool | Statistical data request |

## Troubleshooting Guide

### Issue: n8n can't connect to HTTP Wrapper

**Symptoms:**
- Tool execution fails
- "Connection refused" errors
- Empty responses

**Solutions:**
1. Verify HTTP wrapper is running: `curl http://localhost:5000/tools`
2. Check port 5000 is not blocked by firewall
3. Ensure URLs in n8n tools use `http://localhost:5000`
4. Check HTTP wrapper logs for errors

### Issue: HTTP Wrapper can't reach Weather API

**Symptoms:**
- Tools return error responses
- "Connection refused" in wrapper logs
- Weather data not retrieved

**Solutions:**
1. Verify Weather API is running: `curl http://127.0.0.1:3000/api/forecast/health`
2. Check `WEATHER_API_URL` environment variable
3. Ensure Weather API is on port 3000
4. Test Weather API directly via Swagger UI

### Issue: AI Agent not using tools

**Symptoms:**
- AI responds without calling tools
- No tool execution in n8n logs
- Generic responses instead of real data

**Solutions:**
1. Verify OpenAI API key is configured
2. Check all tool nodes are connected to AI Agent
3. Ensure tool descriptions are clear
4. Try more explicit queries
5. Check OpenAI account has credits

### Issue: Tool returns errors

**Symptoms:**
- `"success": false` in responses
- Error messages in tool output

**Solutions:**
1. Check tool parameters are correct
2. Verify required parameters are provided
3. Test endpoint directly with curl
4. Check Weather API is responding
5. Review HTTP wrapper logs

## Advanced Configuration

### Custom AI Prompts

Edit the AI Agent node in n8n:

```
System Prompt:
You are a professional weather assistant with access to real-time weather data.
When users ask about weather, use the available tools to provide accurate information.
Always be specific about units (Celsius/Fahrenheit) and include relevant details
like humidity, wind speed, and precipitation when appropriate.
```

### Adding Custom Tools

1. **Add endpoint to HTTP Wrapper** (`src/http-wrapper.ts`):
   ```typescript
   app.get("/tools/my-custom-tool", async (req, res) => {
     // Implementation
   });
   ```

2. **Rebuild**:
   ```bash
   npm run build
   npm start
   ```

3. **Add tool node in n8n**:
   - Add "HTTP Request" node
   - Configure URL: `http://localhost:5000/tools/my-custom-tool`
   - Set parameters
   - Connect to AI Agent

4. **Test the new tool**

### Environment Configuration

Create `.env` file:

```env
# HTTP Wrapper Configuration
PORT=5000
WEATHER_API_URL=http://127.0.0.1:3000

# Optional: Logging
LOG_LEVEL=info
```

### Port Configuration

If ports conflict, change them:

**HTTP Wrapper:**
```bash
PORT=8080 npm start
```
Update n8n tool URLs to `http://localhost:8080`

**Weather API:**
```bash
uvicorn main:app --port 8000
```
Update HTTP wrapper: `WEATHER_API_URL=http://127.0.0.1:8000 npm start`

## Performance Optimization

### Caching (Future Enhancement)

Add Redis caching to HTTP wrapper:
```typescript
// Cache weather data for 5 minutes
const cachedData = await redis.get(cacheKey);
if (cachedData) return JSON.parse(cachedData);
```

### Rate Limiting

Protect endpoints with rate limiting:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per minute
});

app.use(limiter);
```

### Monitoring

Add logging and monitoring:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Security Considerations

### API Key Protection

For production, add API key authentication:

```typescript
const API_KEY = process.env.API_KEY;

app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### CORS Configuration

Already configured for all origins. For production, restrict:

```typescript
app.use(cors({
  origin: 'http://your-n8n-domain.com'
}));
```

## Deployment

### Production Deployment

1. **HTTP Wrapper**:
   ```bash
   npm run build
   NODE_ENV=production npm start
   ```

2. **Use PM2** for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/http-wrapper.js --name weather-wrapper
   pm2 save
   pm2 startup
   ```

3. **Behind Nginx**:
   ```nginx
   location /weather-tools/ {
     proxy_pass http://localhost:5000/;
     proxy_http_version 1.1;
     proxy_set_header Host $host;
   }
   ```

## Support Resources

- **HTTP Wrapper**: See `README.md`
- **Weather API**: See `../WeatherForecastFastAPI/README.md`
- **MCP Server**: See `../WeatherForecastMCP/README.md`
- **n8n Docs**: https://docs.n8n.io

## Summary

This integration provides a complete solution for using weather forecast data in n8n AI Agent workflows:

✅ **HTTP Wrapper** exposes weather tools via REST API
✅ **n8n Workflow** pre-configured with 6 weather tools
✅ **AI Agent** automatically selects appropriate tools
✅ **Full Documentation** with setup guides and examples
✅ **Tested and Working** - all components verified

---

**Ready for n8n AI Agent integration!** 🚀
