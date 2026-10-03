import express from "express";
import { getShelves } from "../controllers/shelfController.js";

const router = express.Router();

// GET /api/shelves - Fetch all shelves sorted by shelfId
router.get("/", getShelves);

export default router;
