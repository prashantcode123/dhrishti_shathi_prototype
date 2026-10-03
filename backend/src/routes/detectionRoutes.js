import express from "express";
import {
  createDetection,
  getDetections,
} from "../controllers/detectionController.js";
import { validateDetection } from "../middleware/validateDetection.js";

const router = express.Router();

// POST /api/detections - Ingest and process a detection event
router.post("/", validateDetection, createDetection);

// GET /api/detections - Query detection log history
router.get("/", getDetections);

export default router;
