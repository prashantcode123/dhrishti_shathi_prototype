import mongoose from "mongoose";

// Connect to MongoDB Atlas using URI from .env
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Stop process on connection failure
  }
};
