import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// GET /api/dashboard/stats
router.get("/stats", getDashboardStats);

// POST /api/demo/reset — wipe all state and restore 12 NORMAL shelves
// router.post("/reset", resetDemo);

export default router;
