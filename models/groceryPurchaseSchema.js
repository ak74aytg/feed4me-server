const mongoose = require('mongoose');
const {Schema} = mongoose;


const groceryPurchaseSchema = new Schema({
    CustomerID : {
        type : mongoose.Schema.ObjectId,
        ref : 'Customer',
        required: true
    },
    item : {
        type : String,
        required: true
    },
    Amount : {
        type : String,
        required : true,
    },
    FarmerID : {
        type : mongoose.Schema.ObjectId,
        ref : 'Farmer',
        required : true
    }
})

module.exports = mongoose.model('Grocery Purchase', groceryPurchaseSchema);