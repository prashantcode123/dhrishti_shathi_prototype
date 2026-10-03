import Shelf from "../models/Shelf.js";
import Alert from "../models/Alert.js";
import { resolveShopId } from "../services/shopResolver.js";

// GET /api/dashboard/stats?shopId=
export const getDashboardStats = async (req, res, next) => {
  try {
    const shopId = await resolveShopId(req.query.shopId);

    const [totalShelves, emptyShelves, lowStockShelves, misplacedShelves, normalShelves, activeAlerts] =
      await Promise.all([
        Shelf.countDocuments({ shopId }),
        Shelf.countDocuments({ shopId, status: "EMPTY" }),
        Shelf.countDocuments({ shopId, status: "LOW_STOCK" }),
        Shelf.countDocuments({ shopId, status: "MISPLACED" }),
        Shelf.countDocuments({ shopId, status: "NORMAL" }),
        Alert.countDocuments({ shopId, status: "ACTIVE" }),
      ]);

    res.json({
      totalShelves,
      emptyShelves,
      lowStockShelves,
      misplacedShelves,
      normalShelves,
      activeAlerts,
    });
  } catch (err) {
    next(err);
  }
};