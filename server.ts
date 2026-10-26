import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { configureApiRoutes } from "./server/api";

const app = express();
const server = createServer(app);

app.disable("x-powered-by");

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// Configure Multi-Model & CodeMastery API routes
configureApiRoutes(app);

// Serve static build in production
const distDir = path.resolve(process.cwd(), "dist");
app.use(express.static(distDir));
app.use(express.static(path.resolve(process.cwd(), "public")));

// SPA fallback
app.get("*", (_req, res) => {
  const indexHtml = path.resolve(distDir, "index.html");
  res.sendFile(indexHtml);
});

const port = Number(process.env.PORT || 3000);
server.listen(port, "0.0.0.0", () => {
  console.log(`CodeMastery server running on http://0.0.0.0:${port}`);
});
