import mongoose from "mongoose";
import Shop from "../models/Shop.js";

export const DEMO_EMAIL = "demo@example.com";

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Returns a shop's ObjectId. Uses the given id, or falls back to Demo Mart.
export const resolveShopId = async (shopId) => {
  if (shopId) {
    if (!mongoose.isValidObjectId(shopId)) throw httpError(400, "Invalid shopId");
    const shop = await Shop.findById(shopId).select("_id");
    if (!shop) throw httpError(404, "Shop not found");
    return shop._id;
  }

  const demo = await Shop.findOne({ email: DEMO_EMAIL }).select("_id");
  if (!demo) throw httpError(404, "Demo shop not found. Run: npm run seed");
  return demo._id;
};

export { httpError };