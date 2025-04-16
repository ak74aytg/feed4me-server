const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
    },
    buyer : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
    },
    crop: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
    },
    quantity : {
        type : Number,
        required: true,
    }
})

module.exports = mongoose.model('purchases', purchaseSchema);