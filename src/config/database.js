import config from "./config.js";
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    let dbName = "unknown";
    try {
      const uri = new URL(config.MONGO_URI);
      dbName = uri.pathname.replace(/^\//, "") || "unknown";
    } catch {
      dbName = "unknown";
    }
    console.log(`✅ DB connected (${dbName})`);
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1); // important for Render
  }
}

export default connectDB;