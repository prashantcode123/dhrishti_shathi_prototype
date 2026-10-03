import bcrypt from "bcryptjs";
import Shop from "../models/Shop.js";
import { signToken } from "../middleware/auth.js";

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const shop = await Shop.findOne({ email: email.toLowerCase().trim() }).select("+password");

    // Same message for unknown email and wrong password
    const ok = shop && (await bcrypt.compare(password, shop.password));
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const safeShop = shop.toObject();
    delete safeShop.password;
    res.json({ token: signToken(shop._id), shop: safeShop });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me : who am I? (used to restore the session on page load)
export const me = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.shopId);
    if (!shop) return res.status(401).json({ message: "Account no longer exists" });
    res.json(shop);
  } catch (err) {
    next(err);
  }
};