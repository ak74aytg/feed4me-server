const mongoose = require("mongoose");

const cropDetailsSchema = new mongoose.Schema({
  farmerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmers",
    required: true,
  },
  name: { 
    type: String, 
    required: true 
  },
  imageUrl: {
    type : String,
  },
  MRP: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  },
});

module.exports = mongoose.model("Crop Details", cropDetailsSchema);