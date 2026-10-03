// Middleware to validate AI detection payloads
import mongoose from "mongoose";
export const validateDetection = (req, res, next) => {
  const { shelfId, issueType, product, confidence } = req.body;
  const errors = [];

  const validIssueTypes = ["EMPTY", "LOW_STOCK", "MISPLACED", "NORMAL"];

  if (!shelfId || typeof shelfId !== "string" || !shelfId.trim()) {
    errors.push("shelfId is required and must be a non-empty string");
  }

  if (!issueType || !validIssueTypes.includes(issueType)) {
    errors.push(
      `issueType is required and must be one of: ${validIssueTypes.join(", ")}`
    );
  }

  if (!product || typeof product !== "string" || !product.trim()) {
    errors.push("product is required and must be a non-empty string");
  }

  if (
    confidence === undefined ||
    confidence === null ||
    typeof confidence !== "number" ||
    isNaN(confidence) ||
    confidence < 0 ||
    confidence > 1
  ) {
    errors.push("confidence is required and must be a number between 0 and 1");
  }

  if (req.body.shopId && !mongoose.isValidObjectId(req.body.shopId)) {
    errors.push("shopId must be a valid id");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};
