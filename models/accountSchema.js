// models/ChatRoom.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Types.ObjectId,
    required: true
  },
  userRole : {
    type: String,
    required: true
  },
  totalSpend: {
    type: Number,
    default: 0,
  },
  feed_coin: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Account", accountSchema);
