const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema({
    item: {
        type: mongoose.Types.ObjectId,
    },
    seller: {
        type: mongoose.Types.ObjectId,
    },
    buyer: {
        type: mongoose.Types.ObjectId,
    },
    itemType: String,
    sellerRole: String,
    buyerRole: String,
    amount: {
        type: Number,
        required: true,
    },
    quantity: Number,
    amount_due: Number,
    amount_paid: Number,
    attempts: Number,
    created_at: Date,
    currency: String,
    entity: String,
    order_id: { type: String, unique: true }, 
    notes: mongoose.Schema.Types.Mixed, 
    offer_id: String,
    receipt: String,
    status: String,
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    coins_earned: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('paymentOrder', paymentOrderSchema);