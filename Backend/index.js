import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/route.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    // origin: "https://campus-schedule-portal-project.onrender.com",
    origin: [
    "http://localhost:5173",
  ],
    credentials: true,
  })
);
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

app.use("/api", route);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING : ${PORT}`);
});

if (!MONGOURL) {
  console.log("MONGO_URL is missing in .env");
} else {
  mongoose
    .connect(MONGOURL, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
    .then(() => {
      console.log("DB connected successfully.");
    })
    .catch((error) => {
      console.log("DB connection failed. Check DNS/network/Atlas IP whitelist.");
      console.log(error?.message || error);
    });
}