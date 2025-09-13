const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Notification = require("../models/notificationSchema");
const Farmer = require("../models/farmerSchema");
const mongoose = require("mongoose");

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
      if (!User)
        return res
          .status(402)
          .send("You are not permitted, Please login again!");
    }
    return User;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};

const getFarmerNotifications = async (req, res) => {
    try {
        const farmer = await extractUserFromToken(req, Farmer);
        const notifications = await Notification.find({recipient : farmer._id, recipientRole: "Farmer"})
            .select("_id type title message isRead").sort({ _id: -1 })
        return res.json({ status: "Notifications added successfully", data: notifications });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
}

const markAsRead = async (req, res) => {
  try {
    const farmer = await extractUserFromToken(req, Farmer);
    const { notification_id } = req.body;
    const notification = await Notification.findById(notification_id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    if (!notification.recipient.equals(farmer._id)) {
      return res
        .status(403)
        .json({ error: "You are not allowed to edit this notification" });
    }
    notification.isRead = true;
    await notification.save();
    return res.json({ status: "Notification marked as read successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
    getFarmerNotifications,
    markAsRead,
}