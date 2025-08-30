const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventorySchema = new Schema({
  //
  name: {
    type: String,
    required: true,
  },
  //description:
  description:{
    type: String
  },
  crop: {
    type: String,
    default: "all",
  },
  //
  totalQuantity: {
    type: Number,
    required: true,
  },
  //
  reservedQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  //
  pricePerUnit: {
    type: Number,
    required: true,
  },
  status : {
    type: String,
    enum: ["available", "full"],
    default: "available",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Storage",
    required: true,
  },
  takenBy: [
    {
      farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        default: null,
      },
      quantity: Number,
      date: { type: Date },
      exitDate: { type: Date },
      status : {
        type: String,
        enum: ["active", "expired"],
        default: "active",
      },
    },
  ],
  location: {
    address: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
});

inventorySchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Inventory", inventorySchema);
