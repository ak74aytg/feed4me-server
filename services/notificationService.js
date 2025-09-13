const Notification = require("../models/notificationSchema");

const sendNotification = async (
  recipient,
  recipientRole,
  sender = null,
  senderRole = null,
  type,
  title,
  message
) => {
  try {
    const notification = new Notification({
      recipient,
      recipientRole,
      sender,
      senderRole,
      type,
      title,
      message,
      link: "",
      isRead: false,
    });

    await notification.save();
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendNotification };
