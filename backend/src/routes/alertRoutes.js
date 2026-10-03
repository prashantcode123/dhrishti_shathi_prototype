import express from "express";
import { getAlerts } from "../controllers/alertController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/alerts - Fetch alerts (active by default, or ?status=ALL)
router.get("/",requireAuth, getAlerts);

export default router;
