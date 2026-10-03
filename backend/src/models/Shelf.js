import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    shelfId: { type: String, required: true },
    name: String,
    status: {
      type: String,
      enum: ["EMPTY", "LOW_STOCK", "MISPLACED", "NORMAL"],
      default: "NORMAL",
    },
    product: String,
    quantity: Number,
    lastDetectionAt: Date,
  },
  { timestamps: true }
);

// SHELF-01 can exist once per shop, not once globally
shelfSchema.index({ shopId: 1, shelfId: 1 }, { unique: true });

export default mongoose.model("Shelf", shelfSchema);