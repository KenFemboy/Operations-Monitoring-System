import mongoose from "mongoose";
import dns from "node:dns";

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

const connectWithRetries = async (mongoUri, sourceName, retryCount, retryDelayMs) => {
  let lastError;

  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
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
        `DB connection attempt ${attempt}/${retryCount} failed: ${
          error?.message || error
        }`
      );

      if (attempt < retryCount) {
        await wait(retryDelayMs);
      }
    }
  }

  throw lastError;
};

export const connectDatabase = async () => {
  const mongoUrl =
    normalizeEnvValue(process.env.MONGO_URL) ||
    normalizeEnvValue(process.env.MONGODB_URI);
  const mongoUrlDirect =
    normalizeEnvValue(process.env.MONGO_URL_DIRECT) ||
    normalizeEnvValue(process.env.MONGODB_URI_DIRECT);
  const mongoDnsServers = parseDnsServers(process.env.MONGO_DNS_SERVERS);
  const retryCount = Number(process.env.DB_CONNECT_RETRIES || 3);
  const retryDelayMs = Number(process.env.DB_RETRY_DELAY_MS || 2000);
  const publicDnsFallback = ["1.1.1.1", "8.8.8.8"];

  if (!mongoUrl) {
    throw new Error("MONGO_URL (or MONGODB_URI) is missing in .env");
  }

  if (mongoDnsServers.length) {
    setDnsServers(mongoDnsServers, "MONGO_DNS_SERVERS");
  }

  try {
    await connectWithRetries(mongoUrl, "MONGO_URL", retryCount, retryDelayMs);
  } catch (error) {
    const message = error?.message || "";
    const isSrvError = message.includes("querySrv") || message.includes("ENOTFOUND");
    let connected = false;

    if (isSrvError && !mongoDnsServers.length) {
      console.log("Detected Atlas SRV DNS issue. Retrying with public DNS resolvers.");

      if (setDnsServers(publicDnsFallback, "automatic fallback")) {
        try {
          await connectWithRetries(
            mongoUrl,
            "MONGO_URL (public DNS fallback)",
            retryCount,
            retryDelayMs
          );
          connected = true;
        } catch (retryError) {
          console.log(`Public DNS fallback failed: ${retryError?.message || retryError}`);
        }
      }
    }

    if (!connected && isSrvError && mongoUrlDirect) {
      console.log("Retrying with MONGO_URL_DIRECT/MONGODB_URI_DIRECT to bypass SRV lookup.");
      await connectWithRetries(mongoUrlDirect, "MONGO_URL_DIRECT", retryCount, retryDelayMs);
      connected = true;
    }

    if (!connected && isSrvError && !mongoUrlDirect) {
      throw new Error(
        `Atlas SRV DNS lookup failed. Set MONGO_DNS_SERVERS (comma-separated resolvers) or add MONGO_URL_DIRECT/MONGODB_URI_DIRECT. Original error: ${message}`
      );
    }

    if (!connected) {
      throw error;
    }
  }
};
