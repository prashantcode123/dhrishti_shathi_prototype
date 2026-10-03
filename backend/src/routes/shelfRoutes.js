import express from "express";
import { getShelves } from "../controllers/shelfController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/shelves - Fetch all shelves sorted by shelfId
router.get("/",requireAuth, getShelves);

export default router;
