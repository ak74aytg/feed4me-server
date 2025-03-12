const mongoose = require('mongoose');
const { Schema } = mongoose;


const storageSchema = new Schema({
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
    capacity :{
        type: String,
    }
})

module.exports = mongoose.model('Storage', storageSchema);