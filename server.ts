import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const STATE_FILE = path.join(DATA_DIR, "dashboard_state.json");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
  }
}

async function readProjects() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveProjects(projects: any) {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  io.emit("projects_updated", projects);
}

async function readState() {
  try {
    const data = await fs.readFile(STATE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      selectedProdProjectIds: [],
      selectedHourlyProjectIds: [],
      selectedSheetIds: []
    };
  }
}

async function saveState(state: any) {
  await ensureDataDir();
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
  io.emit("state_updated", state);
}

async function startServer() {
  await ensureDataDir();

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/projects", async (_req, res) => {
    const projects = await readProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    const projects = req.body;
    await saveProjects(projects);
    res.json({ success: true });
  });

  app.get("/api/state", async (_req, res) => {
    const state = await readState();
    res.json(state);
  });

  app.post("/api/state", async (req, res) => {
    const state = req.body;
    await saveState(state);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
