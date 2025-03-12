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
    type: String
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

module.exports = mongoose.model("Farmers", farmerSchema);