import express from "express";
import { registerShop, getShop, updateNotifications } from "../controllers/shopController.js";
import { validateShop } from "../middleware/validateShop.js";

const router = express.Router();

router.post("/", validateShop, registerShop);
router.get("/:id", getShop);
router.patch("/:id/notifications", updateNotifications);

export default router;