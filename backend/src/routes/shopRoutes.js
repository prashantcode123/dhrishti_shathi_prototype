import express from "express";
import { registerShop, getShop, updateNotifications } from "../controllers/shopController.js";
import { validateShop } from "../middleware/validateShop.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", validateShop, registerShop);
router.get("/:id",requireAuth, getShop);
router.patch("/:id/notifications",requireAuth, updateNotifications);

export default router;