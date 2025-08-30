const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const PaymentOrder = require("../models/orderHistorySchema"); // your mongoose model
const crypto = require("crypto");
const Razorpay = require("razorpay");

const secretKey = process.env.TOKEN_SECRET;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createNewOrder = async (req, res) => {
  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: req.body.receipt,
  };
  try {
    const order = await razorpay.orders.create(options);
    const paymentOrder = new PaymentOrder({
      amount: order.amount,
      amount_due: order.amount_due,
      amount_paid: order.amount_paid,
      attempts: order.attempts,
      created_at: new Date(order.created_at * 1000),
      currency: order.currency,
      entity: order.entity,
      order_id: order.id,
      notes: order.notes || [],
      offer_id: order.offer_id,
      receipt: order.receipt,
      status: order.status,
    });
    await paymentOrder.save();
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const key_secret = process.env.RAZORPAY_SECRET;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body)
    .digest("hex");
  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, error: "Invalid payment signature" });
  }
};

module.exports = {
  createNewOrder,
  verifyPayment,
};
