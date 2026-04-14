import config from "./config.js";
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1); // important for Render
  }
}

export default connectDB;