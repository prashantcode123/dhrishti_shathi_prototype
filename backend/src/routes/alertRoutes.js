import express from "express";
import { getAlerts } from "../controllers/alertController.js";

const router = express.Router();

// GET /api/alerts - Fetch alerts (active by default, or ?status=ALL)
router.get("/", getAlerts);

export default router;
