const mongoose = require('mongoose')
const { Schema } = mongoose;

const customerSchema = new Schema({
    name : {
        type: String,
        required: true
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
      password:{
        type : String,
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
});

module.exports = mongoose.model('Customers', customerSchema)