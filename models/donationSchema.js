const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema ({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'donorModel'
      },
      donorModel: {
        type: String,
        required: true,
        enum: ['Farmers', 'Storage']
      },
      ngo : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'NGOs'
      },
      wasteType : {
        type: String,
        enum : ['human', 'cattle'],
        default: 'human',
      },
      foodType : String,
      quantity: String,
      preparedOn: {
        type: Date,
        required: true,
      },
      imageUrl : String,
      availableOn : {
        from : Date,
        to : Date
      },
      collectionPoint : {
        address: { type: String, required: true },
        coordinates: {
          type: { type: String, enum: ["Point"], default: "Point" },
          coordinates: {
            type: [Number],
            required: true,
          },
        },
      },
      status: {
        type: String,
        enum: ['pending', 'picked up', 'delivered', 'canceled'],
        default: 'pending'
      }
})

donationSchema.index({ "collectionPoint.coordinates": "2dsphere" });

module.exports = mongoose.model('donations', donationSchema)