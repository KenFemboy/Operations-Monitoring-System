import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import adminRoutes from "./routes/admin/index.js";
import authRoutes from "./routes/public/authRoutes.js";
import publicRoutes from "./routes/public/index.js";
import superAdminRoutes from "./routes/superadmin/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      process.env.CLIENT_URL,
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
