import express from "express";
import Detection from "../models/Detection.js";
import Shelf from "../models/Shelf.js";
import Alert from "../models/Alert.js";
import { resolveShopId } from "../services/shopResolver.js";

const router = express.Router();

// POST /api/demo/reset?shopId= : reset only this shop
router.post("/reset", async (req, res, next) => {
  try {
    const shopId = await resolveShopId(req.query.shopId || req.body?.shopId);
    await Detection.deleteMany({ shopId });
    await Alert.deleteMany({ shopId });
    await Shelf.updateMany(
      { shopId },
      { $set: { status: "NORMAL" }, $unset: { product: "", quantity: "", lastDetectionAt: "" } }
    );
    res.json({ message: "Demo data reset" });
  } catch (err) {
    next(err);
  }
});

export default router;