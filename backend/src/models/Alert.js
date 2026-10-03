import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    shelfId: { type: String, required: true },
    issueType: { type: String, required: true, enum: ["EMPTY", "LOW_STOCK", "MISPLACED"] },
    product: String,
    quantity: Number,
    expectedPosition: String,
    detectedPosition: String,
    confidence: Number,
    status: { type: String, enum: ["ACTIVE", "RESOLVED"], default: "ACTIVE" },
    resolvedAt: Date,
    notifiedAt: Date, // used in Step 14
  },
  { timestamps: true }
);

alertSchema.index({ shopId: 1, shelfId: 1, status: 1 });

export default mongoose.model("Alert", alertSchema);