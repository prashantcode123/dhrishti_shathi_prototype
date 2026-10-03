import jwt from "jsonwebtoken";

export const signToken = (shopId) =>
  jwt.sign({ shopId: String(shopId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const readBearer = (req) => {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
};

const fail = (res, message = "Please log in") =>
  res.status(401).json({ message });

// Requires a valid token. Sets req.shopId from the token.
export const requireAuth = (req, res, next) => {
  const token = readBearer(req);
  if (!token) return fail(res);
  try {
    req.shopId = jwt.verify(token, process.env.JWT_SECRET).shopId;
    next();
  } catch {
    fail(res, "Session expired. Please log in again");
  }
};

// For POST /detections: a logged-in user OR a camera/simulator with an API key.
export const authOrDevice = (req, res, next) => {
  const token = readBearer(req);
  if (token) {
    try {
      req.shopId = jwt.verify(token, process.env.JWT_SECRET).shopId;
      return next();
    } catch {
      return fail(res, "Session expired. Please log in again");
    }
  }

  const key = req.headers["x-api-key"];
  if (key && key === process.env.DEVICE_API_KEY) {
    req.shopId = req.body?.shopId; // devices say which shop they report for
    return next();
  }

  fail(res, "Login or device API key required");
};