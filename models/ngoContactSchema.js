const mongoose = require('mongoose');
const {Schema } = mongoose;

const ngoContactSchema = new Schema({
    ngoId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "NGOs",
        require: true,
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
      contactPerson: {
        type : String,
        require : true,
      },
      contactPerson_phone: {
        type: String,
      },
      website: {
        type: String,
      }
})

ngoContactSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('NGOContact', ngoContactSchema)