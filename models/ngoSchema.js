const mongoose = require('mongoose')

const ngoSchema = new mongoose.Schema({
    name : { type : String, require: true},
    registration_number : {
        type: String,
        require: true,
    },
    email : {
        type: String,
        unique: true,
        require: true
    },
    password : {
        type : String,
        require: true,
    },
    focusAreas : {
        type: String,
        require: true,
    },
    establishment: Date,
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    }
})


module.exports = mongoose.model('NGOs', ngoSchema)