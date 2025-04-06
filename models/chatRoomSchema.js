// models/ChatRoom.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  roomId : String,
  participants: [String],
  lastMessage: {
    type: String
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
