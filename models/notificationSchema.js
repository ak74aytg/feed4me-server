const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
    },
    recipientRole: {
        type: String,
        required: true,
    },
    senderRole :{
        type: String,
    },
    type: {
      type: String,
      enum: [
        "order_start",
        "order_success",
        "order_failed",
        "reward",
        "system",
        "job_match",
        "message",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
}, { timestamps: true });

module.exports = mongoose.model('notificationSchema', notificationSchema);