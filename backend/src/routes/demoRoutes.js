import express from "express";
import Detection from "../models/Detection.js";
import Shelf from "../models/Shelf.js";
import Alert from "../models/Alert.js";

const router = express.Router();

// POST /api/demo/reset - wipe history and put every shelf back to NORMAL
router.post("/reset", async (req, res, next) => {
  try {
    await Detection.deleteMany({});
    await Alert.deleteMany({});
    await Shelf.updateMany(
      {},
      { $set: { status: "NORMAL" }, $unset: { product: "", quantity: "", lastDetectionAt: "" } }
    );
    res.json({ message: "Demo data reset" });
  } catch (err) {
    next(err);
  }
});

export default router;