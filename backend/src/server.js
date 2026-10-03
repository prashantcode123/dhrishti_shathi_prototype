import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";

// Route imports
import detectionRoutes from "./routes/detectionRoutes.js";
import shelfRoutes from "./routes/shelfRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Error middleware imports
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: Enable CORS and parse incoming JSON bodies
app.use(
  cors()
);
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.json({ message: "Smart Retail Shelf Monitor API is running" });
});

// Database & server health route
app.get("/api/health", (req, res) => {
  const readyStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbStatus = readyStates[mongoose.connection.readyState] || "unknown";

  res.json({
    status: "ok",
    database: dbStatus,
  });
});

// Mount modular API routes
app.use("/api/detections", detectionRoutes);
app.use("/api/shelves", shelfRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/demo", dashboardRoutes);   // POST /api/demo/reset
app.use("/api/demo", demoRoutes);
app.use("/api/shops", shopRoutes);

app.use("/api/auth", authRoutes);

// Register 404 and central error handling middleware (must be registered last)
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB Atlas first, then start listening
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
