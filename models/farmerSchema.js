const mongoose = require("mongoose");
const { Schema } = mongoose;

const farmerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age:{
    type: String,
  },
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
  password: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    unique: true,
    sparse: true
  },
  mobile: {
    type: String,
    unique: true, 
    sparse: true,
    minlength: 10
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

farmerSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Farmers", farmerSchema);