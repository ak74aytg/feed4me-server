const PaymentOrder = require("../models/orderHistorySchema"); // your mongoose model
const crypto = require("crypto");
const Razorpay = require("razorpay");
const CustomError = require("../utils/customError");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const initiatePayment = async (amount, receipt) => {
  const currency = "INR";
  try {
    console.log(amount + " | " + currency + " | " + receipt);
    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: receipt,
    });
    return order;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "Payment failed! You money will be refunded within 2 working days if debited",
      502
    );
  }
};

const verifyPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    // return true;
  const key_secret = process.env.RAZORPAY_SECRET;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body)
    .digest("hex");
  if (expectedSignature === razorpay_signature) {
    return true
  } else {
    return false
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
};
