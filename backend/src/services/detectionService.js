import Detection from "../models/Detection.js";
import Shelf from "../models/Shelf.js";
import Alert from "../models/Alert.js";
import { resolveShopId, httpError } from "./shopResolver.js";

export const processDetection = async (data) => {
  const shopId = await resolveShopId(data.shopId);

  // 1. The shelf must belong to this shop
  const shelf = await Shelf.findOne({ shopId, shelfId: data.shelfId });
  if (!shelf) throw httpError(404, "Shelf not found for this shop");

  // 2. Save to history
  const detection = await Detection.create({
    shopId,
    shelfId: data.shelfId,
    issueType: data.issueType,
    product: data.product,
    quantity: data.quantity,
    expectedPosition: data.expectedPosition,
    detectedPosition: data.detectedPosition,
    confidence: data.confidence,
    source: data.source,
  });

  // 3. Update the shelf's current status
  shelf.status = data.issueType;
  shelf.product = data.product;
  shelf.quantity = data.quantity;
  shelf.lastDetectionAt = new Date();
  await shelf.save();

  // 4. Alerts
  let alert = null;
  let isNew = false;

  if (data.issueType === "NORMAL") {
    // Shelf is fine again: resolve all its open alerts
    await Alert.updateMany(
      { shopId, shelfId: data.shelfId, status: "ACTIVE" },
      { $set: { status: "RESOLVED", resolvedAt: new Date() } }
    );
  } else {
    // Same issue already open? Don't create a duplicate.
    const existing = await Alert.findOne({
      shopId,
      shelfId: data.shelfId,
      issueType: data.issueType,
      status: "ACTIVE",
    });

    if (existing) {
      alert = existing;
    } else {
      // Different issue: close the old alert, open a new one
      await Alert.updateMany(
        { shopId, shelfId: data.shelfId, status: "ACTIVE" },
        { $set: { status: "RESOLVED", resolvedAt: new Date() } }
      );
      alert = await Alert.create({
        shopId,
        shelfId: data.shelfId,
        issueType: data.issueType,
        product: data.product,
        quantity: data.quantity,
        expectedPosition: data.expectedPosition,
        detectedPosition: data.detectedPosition,
        confidence: data.confidence,
      });
      isNew = true;
    }
  }

  return { detection, shelf, alert, isNew };
};