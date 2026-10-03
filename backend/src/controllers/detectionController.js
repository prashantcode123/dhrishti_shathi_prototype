import Detection from "../models/Detection.js";
import { processDetection } from "../services/detectionService.js";
import { resolveShopId } from "../services/shopResolver.js";

// POST /api/detections
export const createDetection = async (req, res, next) => {
  try {
    const result = await processDetection({ ...req.body, shopId: req.shopId });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
// GET /api/detections?shopId=&limit=&shelfId=
export const getDetections = async (req, res, next) => {
  try {
    const shopId = await resolveShopId(req.shopId);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const filter = { shopId };
    if (req.query.shelfId) filter.shelfId = req.query.shelfId;

    const detections = await Detection.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json(detections);
  } catch (err) {
    next(err);
  }
};