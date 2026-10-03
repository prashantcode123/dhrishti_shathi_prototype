import Alert from "../models/Alert.js";
import { resolveShopId } from "../services/shopResolver.js";

// GET /api/alerts?shopId=&status=ALL
export const getAlerts = async (req, res, next) => {
  try {
    const shopId = await resolveShopId(req.query.shopId);
    const filter = { shopId };
    if (req.query.status !== "ALL") filter.status = "ACTIVE";

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};