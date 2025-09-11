const mongoose = require("mongoose");
const CropDetails = require("./models/cropDetailSchema"); // adjust path if needed
require("dotenv").config();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const categories = ["Vegetable", "Fruit", "pulse", "cash crop"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];
const descriptions = [
  "Fresh from farm",
  "High quality organic produce",
  "Locally sourced",
  "Best in class harvest",
  "Direct from farmers"
];
const stockStatuses = ["In Stock", "Limited", "Out of Stock"];
const MONGO_URI = process.env.MONGO_URI;

async function fillMissingFields() {
  await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

  const crops = await CropDetails.find();

  for (let crop of crops) {
    let updated = false;

    if (crop.initial_stock == null) {
      crop.initial_stock = randomInt(50, 500);
      updated = true;
    }

    if (crop.stock == null) {
      crop.stock = crop.initial_stock;
      updated = true;
    }

    if (!crop.description) {
      crop.description = randomFromArray(descriptions);
      updated = true;
    }

    if (!crop.category) {
      crop.category = randomFromArray(categories);
      updated = true;
    }

    if (!crop.location) {
      crop.location = randomFromArray(locations);
      updated = true;
    }

    if (!crop.harvest_date) {
      crop.harvest_date = randomDate(new Date(2025, 0, 1), new Date(2025, 6, 30)); // Jan–July 2025
      updated = true;
    }

    if (!crop.expiry_date) {
      crop.expiry_date = randomDate(new Date(2025, 7, 1), new Date(2025, 11, 31)); // Aug–Dec 2025
      updated = true;
    }

    if (!crop.minimum_order_quantity) {
      crop.minimum_order_quantity = randomInt(1, 10);
      updated = true;
    }

    if (!crop.stock_status) {
      crop.stock_status = randomFromArray(stockStatuses);
      updated = true;
    }

    if (updated) {
      await crop.save();
      console.log(`Updated crop: ${crop._id}`);
    }
  }

  console.log("Done updating missing fields.");
  mongoose.disconnect();
}

fillMissingFields().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
