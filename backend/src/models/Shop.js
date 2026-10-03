import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    numberOfShelves: { type: Number, required: true, min: 1, max: 50 },

    // How this shop wants to be notified
    notifications: {
      emailEnabled: { type: Boolean, default: true },
      alertTypes: {
        type: [String],
        enum: ["EMPTY", "LOW_STOCK", "MISPLACED"],
        default: ["EMPTY", "LOW_STOCK", "MISPLACED"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);