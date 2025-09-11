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
  initial_stock : {
    type: Number, 
    required: true, 
    min: 0 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  description : String,
  category: {
    type : String,
    enum: ["Vegetable", "Fruit", "pulse", "cash crop"]
  },
  location: { type: String, required: true },
    harvest_date: { type: Date },
    expiry_date: { type: Date },
    minimum_order_quantity: Number,
    stock_status: {
      type: String,
      enum: ["In Stock", "Limited", "Out of Stock"],
      default: "In Stock",
    }
});


module.exports = mongoose.model("Crop Details", cropDetailsSchema);