export const validateShop = (req, res, next) => {
  const { shopName, ownerName, email, phone, numberOfShelves } = req.body;
  const errors = [];

  if (!shopName || !shopName.trim()) errors.push("shopName is required");
  if (!ownerName || !ownerName.trim()) errors.push("ownerName is required");

  if (!email) {
    errors.push("email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("email is not valid");
  }

  if (!phone) {
    errors.push("phone is required");
  } else if (!/^\d{10}$/.test(phone)) {
    errors.push("phone must be exactly 10 digits");
  }

  const shelves = Number(numberOfShelves);
  if (!numberOfShelves) {
    errors.push("numberOfShelves is required");
  } else if (!Number.isInteger(shelves) || shelves < 1 || shelves > 50) {
    errors.push("numberOfShelves must be a whole number from 1 to 50");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};