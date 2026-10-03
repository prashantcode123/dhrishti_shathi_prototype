import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    shelfId: { type: String, required: true },
    issueType: {
      type: String,
      required: true,
      enum: ["EMPTY", "LOW_STOCK", "MISPLACED", "NORMAL"],
    },
    product: { type: String, required: true },
    quantity: Number,
    expectedPosition: String,
    detectedPosition: String,
    confidence: { type: Number, required: true, min: 0, max: 1 },
    source: { type: String, default: "SIMULATOR" },
  },
  { timestamps: true }
);

export default mongoose.model("Detection", detectionSchema);