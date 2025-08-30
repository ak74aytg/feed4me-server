const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    amount_due: Number,
    amount_paid: Number,
    attempts: Number,
    created_at: Date,
    currency: String,
    entity: String,
    order_id: String,
    notes: [String],
    offer_id: String,
    receipt: String,
    status: String,
});

module.exports = mongoose.model('paymentOrder', paymentOrderSchema);