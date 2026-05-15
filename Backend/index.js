import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase } from "./config/database.js";
import adminRoutes from "./routes/admin/index.js";
import authRoutes from "./routes/public/authRoutes.js";
import publicRoutes from "./routes/public/index.js";
import superAdminRoutes from "./routes/superadmin/index.js";
import { validateRequiredEnv } from "./config/env.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../Client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");
const hasClientBuild = fs.existsSync(clientIndexPath);

validateRequiredEnv();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      process.env.CLIENT_URL,
      "https://operations-monitoring-system.onrender.com",
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(bodyParser.json());

app.get("/api/health", (_req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbState = mongoose.connection.readyState;
  const dbConnected = dbState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    service: "operations-monitoring-api",
    db: states[dbState] || "unknown",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/public", publicRoutes);

// Temporary aliases for clients that still use the previous super-admin spelling.
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/super_admin", superAdminRoutes);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(clientIndexPath);
  });
}

app.use((error, _req, res, next) => {
  if (!error) {
    return next();
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? `Image must be ${error.field === "image" ? "50MB" : "5MB"} or smaller`
          : error.message,
    });
  }

  if (error.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid image upload",
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server error",
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`SERVER RUNNING : ${PORT}`);
  });
};

startServer().catch((error) => {
  console.log("DB connection failed. Check DNS/network/Atlas IP whitelist.");
  console.log(error?.message || error);
  process.exit(1);
});
