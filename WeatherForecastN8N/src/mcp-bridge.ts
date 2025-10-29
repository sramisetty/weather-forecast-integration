import express, { Request, Response } from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PORT = process.env.MCP_BRIDGE_PORT || 9000;
const MCP_SERVER_PATH = path.join(__dirname, "../../WeatherForecastMCP/dist/index.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MCP Client that communicates with MCP Server via stdio
class MCPClient {
  private mcpProcess: any;
  private requestQueue: Map<string, any> = new Map();
  private requestId = 0;

  constructor() {
    this.initializeMCPServer();
  }

  private initializeMCPServer() {
    console.log("Starting MCP Server...");
    this.mcpProcess = spawn("node", [MCP_SERVER_PATH], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Handle MCP Server stdout (responses)
    this.mcpProcess.stdout.on("data", (data: Buffer) => {
      const response = data.toString();
      try {
        const jsonResponse = JSON.parse(response);
        const requestId = jsonResponse.id;
        const resolver = this.requestQueue.get(requestId);
        if (resolver) {
          resolver.resolve(jsonResponse.result);
          this.requestQueue.delete(requestId);
        }
      } catch (error) {
        console.error("Error parsing MCP response:", error);
      }
    });

    // Handle MCP Server stderr (logs)
    this.mcpProcess.stderr.on("data", (data: Buffer) => {
      console.log("MCP Server:", data.toString());
    });

    // Handle MCP Server exit
    this.mcpProcess.on("exit", (code: number) => {
      console.log(`MCP Server exited with code ${code}`);
    });
  }

  async listTools(): Promise<any> {
    const requestId = `${++this.requestId}`;
    const request = {
      jsonrpc: "2.0",
      id: requestId,
      method: "tools/list",
      params: {},
    };

    return new Promise((resolve, reject) => {
      this.requestQueue.set(requestId, { resolve, reject });
      this.mcpProcess.stdin.write(JSON.stringify(request) + "\n");

      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.requestQueue.has(requestId)) {
          this.requestQueue.delete(requestId);
          reject(new Error("Request timeout"));
        }
      }, 10000);
    });
  }

  async callTool(toolName: string, args: any): Promise<any> {
    const requestId = `${++this.requestId}`;
    const request = {
      jsonrpc: "2.0",
      id: requestId,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args || {},
      },
    };

    return new Promise((resolve, reject) => {
      this.requestQueue.set(requestId, { resolve, reject });
      this.mcpProcess.stdin.write(JSON.stringify(request) + "\n");

      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.requestQueue.has(requestId)) {
          this.requestQueue.delete(requestId);
          reject(new Error("Request timeout"));
        }
      }, 10000);
    });
  }
}

// Initialize MCP Client
const mcpClient = new MCPClient();

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "MCP Bridge for n8n",
    mcpServerPath: MCP_SERVER_PATH,
  });
});

// List available MCP tools
app.get("/tools", async (req: Request, res: Response) => {
  try {
    const tools = await mcpClient.listTools();
    res.json({ success: true, tools });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Call an MCP tool
app.post("/call/:toolName", async (req: Request, res: Response) => {
  try {
    const { toolName } = req.params;
    const args = req.body;

    const result = await mcpClient.callTool(toolName, args);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Specific tool endpoints for easier n8n integration
app.get("/tools/forecast", async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 5;
    const result = await mcpClient.callTool("get_weather_forecast", { days });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/tools/current", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    const result = await mcpClient.callTool("get_current_weather", { city });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/tools/city-forecast", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    const days = parseInt(req.query.days as string) || 5;
    const result = await mcpClient.callTool("get_city_forecast", {
      city,
      days,
    });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/tools/alerts", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    const result = await mcpClient.callTool("get_weather_alerts", { city });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/tools/statistics", async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const result = await mcpClient.callTool("get_weather_statistics", { days });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  MCP Bridge for n8n                                       ║`);
  console.log(`╠════════════════════════════════════════════════════════════╣`);
  console.log(`║  Bridge running on: http://localhost:${PORT}                 ║`);
  console.log(`║  MCP Server: ${MCP_SERVER_PATH.substring(0, 30).padEnd(33)}║`);
  console.log(`║                                                            ║`);
  console.log(`║  Available endpoints:                                      ║`);
  console.log(`║  • GET  /health        - Health check                      ║`);
  console.log(`║  • GET  /tools         - List MCP tools                    ║`);
  console.log(`║  • POST /call/:tool    - Call MCP tool                     ║`);
  console.log(`║  • GET  /tools/*       - Direct tool endpoints             ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});
