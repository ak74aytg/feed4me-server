const mongoose = require('mongoose')
const { Schema } = mongoose;

const customerSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true, 
        unique: true, 
        minlength: 10
    },
    email: {
        type: String,
        unique: true,
    },
    age:{
        type: String,
    },
    location: {
        type: String
    }
});

module.exports = mongoose.model('Customers', customerSchema)