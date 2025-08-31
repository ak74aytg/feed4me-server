require("dotenv").config(); // <-- add this line
const mongoose = require("mongoose");
const Farmer = require("./models/farmerSchema");

// Replace with your MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

async function migrateProfileImages() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined. Did you set it in .env?");
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Default value for missing profile_image
    const defaultImage = "/uploads/farmer_default.png";

    const result = await Farmer.updateMany(
      {
        $or: [
          { profile_image: { $exists: false } },
          { profile_image: null },
          { profile_image: "" }
        ]
      },
      { $set: { profile_image: defaultImage } }
    );

    console.log(`✅ Updated ${result.modifiedCount} farmers`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    mongoose.disconnect();
  }
}

migrateProfileImages();
