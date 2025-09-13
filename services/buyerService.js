const OrderHistory = require("../models/orderHistorySchema");
const Inventory = require("../models/invertorySchema");
const PaymentService = require("./paymentService");
const CustomError = require("../utils/customError");
const Account = require("../models/accountSchema")
const NotificationService = require("./notificationService")

const generateReward = (amount) => {
  // amount in rupees
  const random = Math.random() * 0.05;
  const reward = Math.floor(amount * random)
  return reward
}

const buyInventory = async (buyer, seller, item, quantity, exitDate, session) => {
  const today = new Date();
  item.reservedQuantity += quantity; 
  if (item.reservedQuantity == item.totalQuantity) item.status = "full"; 
  await item.save({ session });
  const expDate = exitDate ? new Date(exitDate) : new Date(today.getTime() + 1000 * 60 * 60 * 24 * 28);

  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

  const months = diffDays / 28;

  const amount = Math.ceil(quantity * item.pricePerUnit * months) * 100;
  const receipt =
    item.name + " | " + amount / 100 + " | " + buyer.name + " | " + seller.name;

  try {
    const order = await PaymentService.initiatePayment(amount, receipt);
    const orderHistory = new OrderHistory({
      item: item._id,
      seller: seller._id,
      buyer: buyer._id,
      itemType: "Inventory",
      sellerRole: "Storage",
      buyerRole: "Farmer",
      amount: order.amount,
      quantity: quantity,
      amount_due: order.amount_due,
      amount_paid: order.amount_paid,
      attempts: order.attempts,
      created_at: new Date(order.created_at * 1000),
      currency: order.currency,
      entity: order.entity,
      order_id: order.id,
      notes: order.notes,
      offer_id: order.offer_id,
      receipt: order.receipt,
      status: order.status+"/pending",
      reward_earned: 0,
    });
    await orderHistory.save();
    item.takenBy.push({
      farmer: buyer._id,
      quantity: quantity,
      date: Date.now(),
      exitDate: expDate,
      status: "inactive",
      orderId: order.id,
    });
    await item.save({ session })
    await NotificationService.sendNotification(buyer._id, "Farmer", null, null, "order_start", "Order Placed Successfully", "Your order has been initiated. We will notify you once the payment is confirmed.")
    return {"order_id" : order.id, "amount": amount, "amount_inr" :`₹${amount / 100}`};
  } catch (error) {
    item.reservedQuantity -= quantity;
    item.status = "available";
    item.takenBy = item.takenBy.filter(
      (t) =>
        !(
          t.farmer.equals(buyer._id) &&
          t.quantity === quantity &&
          t.exitDate === exitDate &&
          t.status === "inactive"
        )
    );
    await item.save({ session });
    throw error;
  }
};

const updateStatus = async (order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  // ✅ Fetch the order history
  const order_history = await OrderHistory.findOne({ order_id: order_id });
  if (!order_history) {
    throw new CustomError("Order not found", 404);
  }

  order_history.razorpay_order_id = razorpay_order_id
  order_history.razorpay_payment_id = razorpay_payment_id
  order_history.razorpay_signature = razorpay_signature

  const buyerId = order_history.buyer;
  const itemId = order_history.item;
  const quantity = order_history.quantity;

  const item = await Inventory.findById(itemId);
  if (!item) {
    throw new CustomError("Inventory not found", 404);
  }

  const isVerified = PaymentService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isVerified) {
    found = false
    temp = []
    for (let i = 0; i < item.takenBy.length; i++) {
      temp.push(item.takenBy[i])
      if (item.takenBy[i].orderId === order_id) {
        temp.pop(item.takenBy[i])
        found = true
      }
    }
    if(found && order_history.status == "created" || order_history.status == "created/pending"){
      item.takenBy = temp
      item.reservedQuantity = item.reservedQuantity - quantity
      item.status = "available"
      await item.save();
      order_history.status = "failed";
      order_history.attempts = (order_history.attempts || 0) + 1;
      await order_history.save()
      await NotificationService.sendNotification(buyerId, "Farmer", null, null, "order_failed", "Payment Failed" , `Your payment for Order #${order_id} could not be completed. Please try again or use a different payment method.`)
      throw new CustomError(
      "Payment verification failed! If your money is debited then upload some proof of payment to our email.",
        400
      );
    }else if(found){
      return order_history;
    }else{
      throw new CustomError("Oder id does not exist", 400);
    }
  }

  if (order_history.status === "created" || order_history.status === "created/pending"){
    const amount = order_history.amount / 100;
    const reward = generateReward(amount);
    order_history.coins_earned = reward * 100
    await Account.findOneAndUpdate(
    { userId: buyerId, userRole: "Farmer" },
    {
      // Use $inc for atomic increments to avoid race conditions.
      $inc: {
        totalSpend: amount,
        feed_coin: reward,
      },
    },
    {
      // options
      upsert: true, // Create the document if it doesn't exist.
      new: true,    // Return the updated document.
      setDefaultsOnInsert: true, // Apply default values if a new doc is created.
    }
  );
  }

  // ✅ Update takenBy array
  for (let i = 0; i < item.takenBy.length; i++) {
    if (
      item.takenBy[i].farmer.equals(buyerId) &&
      item.takenBy[i].quantity === quantity &&
      item.takenBy[i].status === "inactive"
    ) {
      item.takenBy[i].status = "active";
    }
  }
  await item.save();

  // ✅ Update order history
  order_history.amount_paid = order_history.amount_due;
  order_history.amount_due = 0;
  order_history.status = "success";
  order_history.attempts = (order_history.attempts || 0) + 1;
  await order_history.save();

  await NotificationService.sendNotification(buyerId, "Farmer", null, null, "order_success", "Payment Successful 🎉", `Your payment of ₹${order_history.amount / 100} has been received. Order #{orderId} is confirmed and being processed.`)
  if(order_history.coins_earned > 100){
    await NotificationService.sendNotification(buyerId, "Farmer", null, null, "reward", "Coins Earned 🪙", `You’ve earned ${order_history.coins_earned / 100} coins from Order #${order_id}. Keep shopping to earn more rewards!`)
  }
  return order_history;
};


module.exports = {
  buyInventory,
  updateStatus,
};
