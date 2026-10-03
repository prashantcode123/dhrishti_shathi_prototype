import mongoose from "mongoose";
import Shop from "../models/Shop.js";
import Shelf from "../models/Shelf.js";

// POST /api/shops - register a new shop
export const registerShop = async (req, res, next) => {
    try {
        const { shopName, ownerName, email, phone, address, city, numberOfShelves, notifications } =
            req.body;

        // Reject duplicate emails with a friendly message
        const existing = await Shop.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const shop = await Shop.create({
            shopName,
            ownerName,
            email,
            phone,
            address,
            city,
            numberOfShelves: Number(numberOfShelves),
            notifications,
        });

        const shelves = [];
        for (let i = 1; i <= shop.numberOfShelves; i++) {
            const num = String(i).padStart(2, "0");
            shelves.push({ shopId: shop._id, shelfId: `SHELF-${num}`, name: `Shelf ${num}`, status: "NORMAL" });
        }
        await Shelf.insertMany(shelves);

        res.status(201).json(shop);
    } catch (err) {
        // Safety net if two requests with the same email arrive at once
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email already registered" });
        }
        next(err);
    }
};

// GET /api/shops/:id - get one shop
export const getShop = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid shop id" });
        }

        const shop = await Shop.findById(id);
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        res.json(shop);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/shops/:id/notifications - change notification settings
export const updateNotifications = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { emailEnabled, alertTypes } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid shop id" });
        }

        const validTypes = ["EMPTY", "LOW_STOCK", "MISPLACED"];
        const updates = {};

        if (emailEnabled !== undefined) {
            if (typeof emailEnabled !== "boolean") {
                return res.status(400).json({ message: "emailEnabled must be true or false" });
            }
            updates["notifications.emailEnabled"] = emailEnabled;
        }

        if (alertTypes !== undefined) {
            if (!Array.isArray(alertTypes) || !alertTypes.every((t) => validTypes.includes(t))) {
                return res.status(400).json({
                    message: "alertTypes must be an array containing only EMPTY, LOW_STOCK, MISPLACED",
                });
            }
            updates["notifications.alertTypes"] = alertTypes;
        }

        const shop = await Shop.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        res.json(shop);
    } catch (err) {
        next(err);
    }
};