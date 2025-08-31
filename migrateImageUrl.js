// utils/migrateCropImageUrl.js
const mongoose = require("mongoose");
require("dotenv").config(); // make sure you have a .env with MONGO_URI

// Import the schema
const CropDetails = require("./models/cropDetailSchema");

// Your MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

async function migrateCropImages() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Example: prefix all existing imageUrl values with API domain
    const result = await CropDetails.updateMany(
      {
        $or: [
            { imageUrl: { $exists: false } },
            { imageUrl: null },
            { imageUrl: "" },
        ],
        },
        { $set: { imageUrl: "/uploads/crop_default.png" } }
    );

    console.log(`✅ Updated ${result.modifiedCount} crop documents`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    await mongoose.disconnect();
  }
}

migrateCropImages();
