import mongoose, { ConnectOptions } from "mongoose";
import { config } from "dotenv";
config();

const uri: string = process.env.MONGO_URI || ""; // Ensure a fallback value in case MONGO_URI is undefined

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri, {} as ConnectOptions); // Type assertion for additional Mongoose options
    console.log("MongoDB connected successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("MongoDB connection error:", error.message);
    } else {
      console.error("MongoDB connection error:", error);
    }
    process.exit(1);
  }
};

export default connectDB;
