import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    // origin: "https://campus-schedule-portal-project.onrender.com",
    origin: [
    'http://localhost:3000',
    'https://campus-schedule-portal-project.onrender.com'
  ],
    credentials: true,
  })
);
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully.");
    app.listen(PORT, () => {
      console.log(`SERVER RUNNING : ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
app.use("/api", route);
