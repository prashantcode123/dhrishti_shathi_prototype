import Shelf from "../models/Shelf.js";
import { resolveShopId } from "../services/shopResolver.js";

// GET /api/shelves?shopId=
export const getShelves = async (req, res, next) => {
  try {
    const shopId = await resolveShopId(req.query.shopId);
    const shelves = await Shelf.find({ shopId }).sort({ shelfId: 1 });
    res.json(shelves);
  } catch (err) {
    next(err);
  }
};