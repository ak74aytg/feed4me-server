require("dotenv").config();
const mongoose = require("mongoose");
const CropDetails = require("./models/cropDetailSchema"); // <-- add this

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected to DB");

  const result1 = await CropDetails.updateMany(
    { imageUrl: { $exists: true, $ne: null } },
    [
      {
        $set: {
          images: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ["$images", []] } }, 0] },
              then: { $concatArrays: ["$images", ["$imageUrl"]] },
              else: ["$imageUrl"],
            },
          },
        },
      },
      { $unset: "imageUrl" },
    ]
  );

  console.log("Migrated docs with imageUrl:", result1.modifiedCount);

  const result2 = await CropDetails.updateMany(
    { images: { $exists: false } },
    { $set: { images: [] } }
  );

  console.log("Added empty images array to docs:", result2.modifiedCount);

  await mongoose.disconnect();
  console.log("Migration complete ✅");
}

migrate().catch((err) => {
  console.error("Migration failed ❌", err);
  mongoose.disconnect();
});
