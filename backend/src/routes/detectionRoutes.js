import express from "express";
import {
  createDetection,
  getDetections,
} from "../controllers/detectionController.js";
import { validateDetection } from "../middleware/validateDetection.js";
import { requireAuth, authOrDevice } from "../middleware/auth.js";

const router = express.Router();

// POST /api/detections - Ingest and process a detection event
router.post("/",authOrDevice, validateDetection, createDetection);

// GET /api/detections - Query detection log history
router.get("/",requireAuth, getDetections);

export default router;
