import dotenv from "dotenv";
import mongoose from "mongoose";
import Shop from "../models/Shop.js";
import Shelf from "../models/Shelf.js";
import Alert from "../models/Alert.js";
import Detection from "../models/Detection.js";
import { DEMO_EMAIL } from "../services/shopResolver.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear everything
  await Promise.all([
    Shop.deleteMany({}),
    Shelf.deleteMany({}),
    Alert.deleteMany({}),
    Detection.deleteMany({}),
  ]);

  // Remove the old unique index on shelfId, then build the new indexes
  try {
    await Shelf.collection.dropIndexes();
  } catch (e) {
    // collection may not have extra indexes yet; ignore
  }
  await Shelf.syncIndexes();

  // Demo shop
  const shop = await Shop.create({
    shopName: "Demo Mart",
    ownerName: "Demo Owner",
    email: DEMO_EMAIL,
    phone: "9999999999",
    address: "Demo Street",
    city: "Raipur",
    numberOfShelves: 12,
  });

  const shelves = [];
  for (let i = 1; i <= 12; i++) {
    const num = String(i).padStart(2, "0");
    shelves.push({ shopId: shop._id, shelfId: `SHELF-${num}`, name: `Shelf ${num}`, status: "NORMAL" });
  }
  await Shelf.insertMany(shelves);

  console.log(`Seeded ${shelves.length} shelves for Demo Mart`);
  console.log(`Demo Mart shopId: ${shop._id}`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});