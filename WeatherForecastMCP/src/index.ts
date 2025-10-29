#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// Configuration
const API_BASE_URL = process.env.WEATHER_API_URL || "http://127.0.0.1:3000";

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

  async createForecastRequest(city?: string, days: number = 5): Promise<any> {
    const response = await axios.post(`${this.baseURL}/api/forecast/request`, {
      city,
      days,
    });
    return response.data;
  }

  async getHealth(): Promise<any> {
    const response = await axios.get(`${this.baseURL}/api/forecast/health`);
    return response.data;
  }
}

// Define MCP Tools
const TOOLS: Tool[] = [
  {
    name: "get_weather_forecast",
    description:
      "Get weather forecast for a specified number of days. Returns temperature, humidity, wind speed, precipitation, and more.",
    inputSchema: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "Number of days to forecast (1-30)",
          default: 5,
          minimum: 1,
          maximum: 30,
        },
      },
    },
  },
  {
    name: "get_current_weather",
    description:
      "Get current weather conditions for a specific city or default location. Includes temperature, humidity, wind, and atmospheric pressure.",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name (optional)",
        },
      },
    },
  },
  {
    name: "get_city_forecast",
    description:
      "Get weather forecast for a specific city. Returns multi-day forecast with detailed weather information.",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name (required)",
        },
        days: {
          type: "number",
          description: "Number of days to forecast (1-30)",
          default: 5,
          minimum: 1,
          maximum: 30,
        },
      },
      required: ["city"],
    },
  },
  {
    name: "get_detailed_forecast",
    description:
      "Get detailed weather forecast for a specific date. Includes all basic weather data plus cloud cover, UV index, visibility, and active alerts.",
    inputSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description:
            "Date for the forecast (ISO format: YYYY-MM-DDTHH:MM:SS)",
        },
        city: {
          type: "string",
          description: "City name (optional)",
        },
      },
      required: ["date"],
    },
  },
  {
    name: "get_detailed_forecasts",
    description:
      "Get detailed weather forecasts for multiple days. Returns extended information including cloud cover, UV index, visibility, and potential weather alerts.",
    inputSchema: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "Number of days to forecast (1-30)",
          default: 5,
          minimum: 1,
          maximum: 30,
        },
      },
    },
  },
  {
    name: "get_weather_alerts",
    description:
      "Get active weather alerts for a specific area. Includes alert type, severity level, description, and time periods.",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name (optional)",
        },
      },
    },
  },
  {
    name: "get_weather_statistics",
    description:
      "Get weather statistics for a specified period. Includes average, maximum, and minimum temperatures, average humidity, total precipitation, and average wind speed.",
    inputSchema: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "Number of days to analyze (1-365)",
          default: 7,
          minimum: 1,
          maximum: 365,
        },
      },
    },
  },
  {
    name: "create_custom_forecast_request",
    description:
      "Create a custom weather forecast request with specific parameters. Allows flexible querying with city and days parameters.",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name (optional)",
        },
        days: {
          type: "number",
          description: "Number of days to forecast (1-30)",
          default: 5,
          minimum: 1,
          maximum: 30,
        },
      },
    },
  },
  {
    name: "check_weather_api_health",
    description: "Check the health status of the Weather Forecast API service.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Create MCP Server
const server = new Server(
  {
    name: "weather-forecast-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Weather API Client
const weatherClient = new WeatherAPIClient(API_BASE_URL);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    switch (name) {
      case "get_weather_forecast": {
        const days = (args?.days as number) || 5;
        result = await weatherClient.getForecast(days);
        break;
      }

      case "get_current_weather": {
        const city = args?.city as string | undefined;
        result = await weatherClient.getCurrentWeather(city);
        break;
      }

      case "get_city_forecast": {
        const city = args?.city as string;
        const days = (args?.days as number) || 5;
        if (!city) {
          throw new Error("City parameter is required");
        }
        result = await weatherClient.getForecastByCity(city, days);
        break;
      }

      case "get_detailed_forecast": {
        const date = args?.date as string;
        const city = args?.city as string | undefined;
        if (!date) {
          throw new Error("Date parameter is required");
        }
        result = await weatherClient.getDetailedForecast(date, city);
        break;
      }

      case "get_detailed_forecasts": {
        const days = (args?.days as number) || 5;
        result = await weatherClient.getDetailedForecasts(days);
        break;
      }

      case "get_weather_alerts": {
        const city = args?.city as string | undefined;
        result = await weatherClient.getWeatherAlerts(city);
        break;
      }

      case "get_weather_statistics": {
        const days = (args?.days as number) || 7;
        result = await weatherClient.getWeatherStatistics(days);
        break;
      }

      case "create_custom_forecast_request": {
        const city = args?.city as string | undefined;
        const days = (args?.days as number) || 5;
        result = await weatherClient.createForecastRequest(city, days);
        break;
      }

      case "check_weather_api_health": {
        result = await weatherClient.getHealth();
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.message ||
      "An unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather Forecast MCP Server running on stdio");
  console.error(`Connected to Weather API at: ${API_BASE_URL}`);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
