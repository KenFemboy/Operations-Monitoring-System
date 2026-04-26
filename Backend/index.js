import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import dns from "node:dns";
import route from "./routes/route.js";
import cors from "cors";
const app = express();
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
dotenv.config();

const normalizeEnvValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.replace(/^['\"]|['\"]$/g, "");
};

const parseDnsServers = (value) =>
  normalizeEnvValue(value)
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) || [];

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  normalizeEnvValue(process.env.MONGO_URL) ||
  normalizeEnvValue(process.env.MONGODB_URI);
const MONGO_URL_DIRECT =
  normalizeEnvValue(process.env.MONGO_URL_DIRECT) ||
  normalizeEnvValue(process.env.MONGODB_URI_DIRECT);
const MONGO_DNS_SERVERS = parseDnsServers(process.env.MONGO_DNS_SERVERS);
const DB_CONNECT_RETRIES = Number(process.env.DB_CONNECT_RETRIES || 3);
const DB_RETRY_DELAY_MS = Number(process.env.DB_RETRY_DELAY_MS || 2000);
const PUBLIC_DNS_FALLBACK = ["1.1.1.1", "8.8.8.8"];

app.use("/api", route);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setDnsServers = (servers, reason) => {
  if (!servers.length) {
    return false;
  }

  try {
    dns.setServers(servers);
    console.log(
      `Using DNS resolvers for MongoDB (${reason}): ${servers.join(", ")}`
    );
    return true;
  } catch (error) {
    console.log(`Failed to set DNS resolvers (${reason}): ${error?.message || error}`);
    return false;
  }
};

const connectWithRetries = async (mongoUri, sourceName) => {
  let lastError;

  for (let attempt = 1; attempt <= DB_CONNECT_RETRIES; attempt += 1) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log(`DB connected successfully using ${sourceName}.`);
      return;
    } catch (error) {
      lastError = error;
      console.log(
        `DB connection attempt ${attempt}/${DB_CONNECT_RETRIES} failed: ${
          error?.message || error
        }`
      );

      if (attempt < DB_CONNECT_RETRIES) {
        await wait(DB_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
};

const startServer = async () => {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL (or MONGODB_URI) is missing in .env");
  }

  if (MONGO_DNS_SERVERS.length) {
    setDnsServers(MONGO_DNS_SERVERS, "MONGO_DNS_SERVERS");
  }

  try {
    await connectWithRetries(MONGO_URL, "MONGO_URL");
  } catch (error) {
    const message = error?.message || "";
    const isSrvError = message.includes("querySrv") || message.includes("ENOTFOUND");
    let connected = false;

    if (isSrvError && !MONGO_DNS_SERVERS.length) {
      console.log(
        "Detected Atlas SRV DNS issue. Retrying with public DNS resolvers."
      );

      if (setDnsServers(PUBLIC_DNS_FALLBACK, "automatic fallback")) {
        try {
          await connectWithRetries(MONGO_URL, "MONGO_URL (public DNS fallback)");
          connected = true;
        } catch (retryError) {
          console.log(
            `Public DNS fallback failed: ${retryError?.message || retryError}`
          );
        }
      }
    }

    if (!connected && isSrvError && MONGO_URL_DIRECT) {
      console.log(
        "Retrying with MONGO_URL_DIRECT/MONGODB_URI_DIRECT to bypass SRV lookup."
      );
      await connectWithRetries(MONGO_URL_DIRECT, "MONGO_URL_DIRECT");
      connected = true;
    }

    if (!connected && isSrvError && !MONGO_URL_DIRECT) {
      throw new Error(
        `Atlas SRV DNS lookup failed. Set MONGO_DNS_SERVERS (comma-separated resolvers) or add MONGO_URL_DIRECT/MONGODB_URI_DIRECT. Original error: ${message}`
      );
    }

    if (!connected) {
      throw error;
    }
  }

  app.listen(PORT, () => {
    console.log(`SERVER RUNNING : ${PORT}`);
  });
};

startServer().catch((error) => {
  console.log("DB connection failed. Check DNS/network/Atlas IP whitelist.");
  console.log(error?.message || error);
  process.exit(1);
});
