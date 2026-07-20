import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { DashboardData, Shipment, Activity, Optimization, RiskItem } from "./src/types.js";

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-Memory Database
const state: DashboardData = {
  inventoryHealth: 94,
  stockMove: "2.4k",
  overallHealth: 98.2,
  metrics: {
    inventoryRisk: "Low",
    inventoryRiskVal: 12,
    demandStability: 88,
    supplierReliability: 94,
    warehouseEfficiency: 86,
  },
  riskRadar: [
    { id: "1", label: "Container Delays", value: "3 Active", type: "delay", status: "active" },
    { id: "2", label: "Weather Impact", value: "Low", type: "weather", status: "low" },
    { id: "3", label: "Port Congestion", value: "Shanghai/Rotterdam", type: "congestion", status: "warning" },
  ],
  optimizations: [
    { id: "opt-1", title: "Bundle SKU-901 + SKU-042", lift: "+14% Lift", details: "Predicted clearance speed increase for aging inventory.", type: "bundle" },
    { id: "opt-2", title: "Discount Batch-882", lift: "Expires 30d", details: "Recommended 15% markdown to prevent write-off.", type: "discount" },
  ],
  activities: [
    { id: "act-1", title: "PO-2024-0892 Approved", type: "approval", location: "Global Logistics Hub • Shanghai", details: "Approved by System Automatons", timeStr: "2 minutes ago", timestamp: Date.now() - 120000 },
    { id: "act-2", title: "Stock Alert: SKU-4029 Low", type: "warning", location: "Warehouse NYC-04 • Critical", details: "Current inventory: 15 units", timeStr: "14 minutes ago", timestamp: Date.now() - 840000 },
    { id: "act-3", title: "Transfer HK-12 Complete", type: "transfer", location: "3,400 units moved to LN-01", details: "Routed through maritime carrier", timeStr: "45 minutes ago", timestamp: Date.now() - 2700000 },
    { id: "act-4", title: "Shipment Departure", type: "departure", location: "Carrier: Maersk • Vsl: Enterprise", details: "Port of departure: Shanghai", timeStr: "1 hour ago", timestamp: Date.now() - 3600000 },
  ],
  operations: {
    incoming: { count: 4, trend: "↑ 12%", nextDue: "2h" },
    outgoing: { count: 12, trend: "Stable", peakHour: "14:00" },
    returns: { count: 2, trend: "↓ 5%", avgProc: "45m" },
    delayed: { count: 1, details: "CS-221 (Customs)" },
    transfers: { count: 3, trend: "In Progress", route: "Global Routing" },
  },
  mapNodes: [
    { id: "node-nyc", label: "NYC-04 (HQ)", lat: 40.7128, lng: -74.0060, type: "hq", coords: { top: "35%", left: "25%" } },
    { id: "node-hk", label: "HK-12", lat: 22.3193, lng: 114.1694, type: "node", coords: { top: "45%", left: "78%" } },
    { id: "node-ln", label: "LN-01", lat: 51.5074, lng: -0.1278, type: "hub", coords: { top: "38%", left: "48%" } },
  ],
  shipments: [
    { id: "ship-1", code: "PO-2024-0892", origin: "Shanghai", destination: "New York", carrier: "Maersk", status: "Incoming", details: "Approved & scheduled", timestamp: Date.now() - 120000 },
    { id: "ship-2", code: "SKU-4029", origin: "Chicago", destination: "New York", carrier: "FedEx", status: "Delayed", details: "Weather delays", timestamp: Date.now() - 840000 },
    { id: "ship-3", code: "TR-HK12", origin: "Hong Kong", destination: "London", carrier: "Cosco", status: "Transfers", details: "Completed transfer", timestamp: Date.now() - 2700000 },
  ],
};

// API Endpoints
app.get("/api/data", (req, res) => {
  res.json(state);
});

app.post("/api/shipments", (req, res) => {
  try {
    const { code, origin, destination, carrier, status, details, value, items, eta } = req.body;

    if (!code || !origin || !destination) {
      return res.status(400).json({ error: "Code, origin, and destination are required." });
    }

    const newShipment: Shipment = {
      id: `ship-${Date.now()}`,
      code,
      origin,
      destination,
      carrier: carrier || "DHL",
      status: status || "Incoming",
      details: details || "Newly registered shipment",
      value: value || "N/A",
      items: items || "N/A",
      eta: eta || "N/A",
      timestamp: Date.now()
    };

    state.shipments.unshift(newShipment);

    // Update Operations Center & Activity Feed
    const statusLower = newShipment.status.toLowerCase();
    if (statusLower === "incoming") {
      state.operations.incoming.count += 1;
    } else if (statusLower === "outgoing") {
      state.operations.outgoing.count += 1;
    } else if (statusLower === "returns") {
      state.operations.returns.count += 1;
    } else if (statusLower === "delayed") {
      state.operations.delayed.count += 1;
    } else if (statusLower === "transfers") {
      state.operations.transfers.count += 1;
    }

    // Add activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      title: `${newShipment.code} Registered`,
      type: statusLower === "delayed" ? "warning" : "departure",
      location: `${newShipment.origin} → ${newShipment.destination}`,
      details: `${newShipment.carrier} • Status: ${newShipment.status}`,
      timeStr: "Just now",
      timestamp: Date.now()
    };

    state.activities.unshift(newActivity);

    // Dynamic adjustment to health metrics to show responsiveness
    state.overallHealth = Math.min(100, Number((state.overallHealth + 0.1).toFixed(1)));
    state.stockMove = `${(parseFloat(state.stockMove) + 0.1).toFixed(1)}k`;

    return res.status(201).json({ success: true, shipment: newShipment, activity: newActivity });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// AI Chat Integration
app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();

    // Summarize State to give full context to Gemini
    const stateSummary = `
      You are the Inventra AI Global Copilot, an advanced logistical AI system monitoring global supply chains.
      You are speaking directly to Alex Chen, the Executive Admin.
      
      Here is the current real-time operations data of Inventra AI:
      - Overall Supply Chain Health: ${state.overallHealth}% (Aggregated operational reliability)
      - Inventory Health: ${state.inventoryHealth}%
      - Daily Stock Move: ${state.stockMove}
      - Metrics:
        * Inventory Risk: ${state.metrics.inventoryRisk} (${state.metrics.inventoryRiskVal}% value)
        * Demand Stability: ${state.metrics.demandStability}%
        * Supplier Reliability: ${state.metrics.supplierReliability}%
        * Warehouse Efficiency: ${state.metrics.warehouseEfficiency}%
      
      - Risk Radar:
        ${state.riskRadar.map(r => `* ${r.label}: ${r.value} (${r.status})`).join("\n")}
        
      - Live Operations Control Center Counts:
        * Incoming: ${state.operations.incoming.count} (Next due in ${state.operations.incoming.nextDue}, trend: ${state.operations.incoming.trend})
        * Outgoing: ${state.operations.outgoing.count} (Peak hour: ${state.operations.outgoing.peakHour})
        * Returns: ${state.operations.returns.count} (Avg processing: ${state.operations.returns.avgProc})
        * Delayed: ${state.operations.delayed.count} (${state.operations.delayed.details})
        * Transfers: ${state.operations.transfers.count} (${state.operations.transfers.route})
        
      - Registered Shipments:
        ${state.shipments.map(s => `* Code: ${s.code}, Carrier: ${s.carrier}, Route: ${s.origin} to ${s.destination}, Status: ${s.status}, Details: ${s.details}`).join("\n")}
        
      - Recent Activities:
        ${state.activities.map(a => `* ${a.title} at ${a.location} (${a.timeStr})`).join("\n")}

      - Available AI Optimizations:
        ${state.optimizations.map(o => `* "${o.title}" (${o.lift}): ${o.details}`).join("\n")}

      Instructions:
      - Keep your responses precise, factual, clean, and highly professional.
      - Act as a true strategic copilot: analyze numbers, recommend actions (e.g. re-routing to avoid customs or weather delays), and calculate cost impacts.
      - If Alex asks to register, schedule or create a new shipment, prompt them to use the "New Shipment" button in the sidebar or provide details like Code, Origin, Destination, Carrier, and Status so we can help.
      - You can use rich Markdown (bullet points, bold text, simple tables) for formatting. Keep responses highly concise and tailored for a busy executive.
    `;

    // Construct standard history for generation
    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const h of chatHistory) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      }
    }
    // Append current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: stateSummary,
        temperature: 0.7,
      }
    });

    const botMessage = response.text || "I apologize, I could not process your request at this moment.";
    res.json({ reply: botMessage });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the Gemini Copilot." });
  }
});

// Vite server integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static files served from dist/ in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
