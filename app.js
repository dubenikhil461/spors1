import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import approutes from "./src/route.js";
import { getPredictionByDevice } from "./src/routes/getPredictionByDevice.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["*","https://magical-platypus-b14617.netlify.app", "http://localhost:8080"], // allowed frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB(); 
    console.log("✅ MongoDB connected");

    await getPredictionByDevice();

    // Routes
    app.use("/api", approutes);

    app.get("/", (req, res) => {
      res.send("API is running");
    });

    // Server
    app.listen(9000, () => console.log("🚀 Server running on port 9000"));
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
