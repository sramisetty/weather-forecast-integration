import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

// Configuration
const PORT = process.env.PORT || 5000;
const API_BASE_URL = process.env.WEATHER_API_URL || "http://127.0.0.1:3000";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Weather API Client
class WeatherAPIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getForecast(days: number = 5): Promise<any> {
    const response = await axios.get(`${this.baseURL}/api/forecast`, {
      params: { days },
    });
    return response.data;
  }

  async getCurrentWeather(city?: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/api/forecast/current`, {
      params: city ? { city } : {},
    });
    return response.data;
  }

  async getForecastByCity(city: string, days: number = 5): Promise<any> {
    const response = await axios.get(
      `${this.baseURL}/api/forecast/city/${encodeURIComponent(city)}`,
      { params: { days } }
    );
    return response.data;
  }

  async getDetailedForecast(date: string, city?: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/api/forecast/detailed`, {
      params: {
        date,
        ...(city && { city }),
      },
    });
    return response.data;
  }

  async getDetailedForecasts(days: number = 5): Promise<any> {
    const response = await axios.get(
      `${this.baseURL}/api/forecast/detailed/multi`,
      { params: { days } }
    );
    return response.data;
  }

  async getWeatherAlerts(city?: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/api/forecast/alerts`, {
      params: city ? { city } : {},
    });
    return response.data;
  }

  async getWeatherStatistics(days: number = 7): Promise<any> {
    const response = await axios.get(`${this.baseURL}/api/forecast/statistics`, {
      params: { days },
    });
    return response.data;
  }

  async getHealth(): Promise<any> {
    const response = await axios.get(`${this.baseURL}/api/forecast/health`);
    return response.data;
  }
}

const weatherClient = new WeatherAPIClient(API_BASE_URL);

// API Routes for n8n

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Weather Forecast n8n HTTP Wrapper",
    version: "1.0.0",
    description: "HTTP wrapper for Weather Forecast tools - designed for n8n AI Agent integration",
    endpoints: {
      tools: "/tools (GET) - List all available tools",
      forecast: "/tools/forecast (GET) - Get weather forecast",
      current: "/tools/current (GET) - Get current weather",
      cityForecast: "/tools/city-forecast (GET) - Get city forecast",
      detailed: "/tools/detailed (GET) - Get detailed forecast",
      detailedMulti: "/tools/detailed-multi (GET) - Get detailed multi-day forecasts",
      alerts: "/tools/alerts (GET) - Get weather alerts",
      statistics: "/tools/statistics (GET) - Get weather statistics",
      health: "/tools/health (GET) - Health check",
    },
    documentation: "/docs",
  });
});

// List all tools
app.get("/tools", (req: Request, res: Response) => {
  res.json({
    tools: [
      {
        name: "get_weather_forecast",
        endpoint: "/tools/forecast",
        method: "GET",
        description: "Get weather forecast for a specified number of days",
        parameters: {
          days: "Number of days (1-30), default: 5",
        },
      },
      {
        name: "get_current_weather",
        endpoint: "/tools/current",
        method: "GET",
        description: "Get current weather conditions",
        parameters: {
          city: "City name (optional)",
        },
      },
      {
        name: "get_city_forecast",
        endpoint: "/tools/city-forecast",
        method: "GET",
        description: "Get weather forecast for a specific city",
        parameters: {
          city: "City name (required)",
          days: "Number of days (1-30), default: 5",
        },
      },
      {
        name: "get_detailed_forecast",
        endpoint: "/tools/detailed",
        method: "GET",
        description: "Get detailed weather forecast for a specific date",
        parameters: {
          date: "Date in ISO format (required)",
          city: "City name (optional)",
        },
      },
      {
        name: "get_detailed_forecasts",
        endpoint: "/tools/detailed-multi",
        method: "GET",
        description: "Get detailed weather forecasts for multiple days",
        parameters: {
          days: "Number of days (1-30), default: 5",
        },
      },
      {
        name: "get_weather_alerts",
        endpoint: "/tools/alerts",
        method: "GET",
        description: "Get active weather alerts",
        parameters: {
          city: "City name (optional)",
        },
      },
      {
        name: "get_weather_statistics",
        endpoint: "/tools/statistics",
        method: "GET",
        description: "Get weather statistics for a period",
        parameters: {
          days: "Number of days (1-365), default: 7",
        },
      },
      {
        name: "check_health",
        endpoint: "/tools/health",
        method: "GET",
        description: "Check Weather API health status",
        parameters: {},
      },
    ],
  });
});

// Tool endpoints

// Get weather forecast
app.get("/tools/forecast", async (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 5;
    const result = await weatherClient.getForecast(days);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Get current weather
app.get("/tools/current", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string | undefined;
    const result = await weatherClient.getCurrentWeather(city);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Get city forecast
app.get("/tools/city-forecast", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    const days = req.query.days ? parseInt(req.query.days as string) : 5;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: "City parameter is required",
      });
    }

    const result = await weatherClient.getForecastByCity(city, days);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Get detailed forecast
app.get("/tools/detailed", async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    const city = req.query.city as string | undefined;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: "Date parameter is required",
      });
    }

    const result = await weatherClient.getDetailedForecast(date, city);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Get detailed forecasts
app.get("/tools/detailed-multi", async (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 5;
    const result = await weatherClient.getDetailedForecasts(days);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Get weather alerts
app.get("/tools/alerts", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string | undefined;
    const result = await weatherClient.getWeatherAlerts(city);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Get weather statistics
app.get("/tools/statistics", async (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const result = await weatherClient.getWeatherStatistics(days);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Health check
app.get("/tools/health", async (req: Request, res: Response) => {
  try {
    const result = await weatherClient.getHealth();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.detail || error.message,
    });
  }
});

// Documentation endpoint
app.get("/docs", (req: Request, res: Response) => {
  res.json({
    title: "Weather Forecast HTTP Wrapper API",
    description: "HTTP wrapper for n8n AI Agent integration with Weather Forecast tools",
    baseURL: `http://localhost:${PORT}`,
    weatherAPIURL: API_BASE_URL,
    usage: {
      listTools: `GET /tools`,
      examples: {
        forecast: `GET /tools/forecast?days=5`,
        current: `GET /tools/current?city=London`,
        cityForecast: `GET /tools/city-forecast?city=Tokyo&days=3`,
        alerts: `GET /tools/alerts?city=NewYork`,
        statistics: `GET /tools/statistics?days=7`,
        health: `GET /tools/health`,
      },
    },
    integration: {
      n8n: "Use HTTP Request nodes to call these endpoints in your n8n AI Agent workflow",
      format: "All responses return { success: boolean, data: any, error?: string }",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  Weather Forecast HTTP Wrapper for n8n                    ║`);
  console.log(`╠════════════════════════════════════════════════════════════╣`);
  console.log(`║  Server running on: http://localhost:${PORT}                 ║`);
  console.log(`║  Weather API URL:   ${API_BASE_URL.padEnd(33)}║`);
  console.log(`║                                                            ║`);
  console.log(`║  Available endpoints:                                      ║`);
  console.log(`║  • GET  /              - API info                          ║`);
  console.log(`║  • GET  /tools         - List all tools                    ║`);
  console.log(`║  • GET  /docs          - API documentation                 ║`);
  console.log(`║  • GET  /tools/*       - Tool endpoints                    ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});
