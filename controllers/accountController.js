const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Inventory = require("../models/invertorySchema");
const storageOwner = require("../models/storageSchema");
const Farmer = require("../models/farmerSchema");
const OrderHistorySchema = require("../models/orderHistorySchema");
const BuyService = require("../services/buyerService");

const secretKey = process.env.TOKEN_SECRET;

const extractUserFromToken = async (req, Model) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res.status(403).send("A token is required for authentication");
    const identifier = jwt.verify(token, secretKey);
    let User;
    User = await Model.findOne({ mobile: identifier });
    if (!User) {
      User = await Model.findOne({ email: identifier });
    }
    return User;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};

const getFarmerRewards = async (req, res) => {
  try {
    const farmer = await extractUserFromToken(req, Farmer);

    const orders = await OrderHistorySchema.aggregate([
      {
        $match: {
          buyer: farmer._id,
          status: "success",
          coins_earned: { $exists: true },
        },
      },
      {
        $project: {
          _id: 1,
          receipt: 1,
          createdAt: 1,
          amount: { $divide: ["$amount", 100] },
          coins_earned: { $divide: ["$coins_earned", 100] },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.json({
      status: "coins fetched successfully",
      orders,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const order = await OrderHistorySchema.findById(transaction_id);
    if (order.status == "success") {
      return res.json({ status: "payment verified successfully" });
    }
    const order_id = order.order_id;
    const razorpay_order_id = order.razorpay_order_id;
    const razorpay_payment_id = order.razorpay_payment_id;
    const razorpay_signature = order.razorpay_signature;
    
    if (order.status == "failed" && verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)){
      order.status = "lost"
      await order.save()
      return res.json({status: "YIf any amount was debited from your account, it will be credited back shortly."})
    }

    const order_history = await BuyService.updateStatus(
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (order_history.status == "success") {
      return res.json({ status: "payment verified successfully" });
    }else{
      return res.status(401).send({ error: "payment verification failed" });
    }

  } catch (error) {
    res.status(error.statusCode).send({ error: error.message });
  }
};

module.exports = {
  getFarmerRewards,
  verifyTransaction,
};
