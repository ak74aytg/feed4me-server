const mongoose = require('mongoose');
const { Schema } = mongoose;

const storageCapacity = new Schema({
    StorageID : {
        type : mongoose.Schema.ObjectId,
        ref : 'Storage',
        required : true
    },
    cropID : {
        type : mongoose.Schema.ObjectId,
        ref : 'CropDetails',
        required : true
    },
    AmountStored : {
        type : String,
    },
    RatePerKg : {
        type : String,
    }
})


module.exports = mongoose.model('Storage Capacity', storageCapacity)