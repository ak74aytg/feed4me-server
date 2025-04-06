const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const Storage = require('../models/storageSchema')
const Message = require('../models/messageSchema');
const Chats = require('../models/chatRoomSchema');
const Farmer = require('../models/farmerSchema')

const extractUsernameFromToken = (token) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      throw new CustomError("Invalid token", 401);
    }
  };  

const getMessages = async (req, res) =>{
    const { chatId } = req.params;
    const messages = await Message.find({roomId : chatId});
    res.json({tatus: "Messages fetched successfully", data: messages});
}

const getChatList = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
  
    try {
      const list = await Chats.find({
        participants: userId,
      });
  
      const result = await Promise.all(
        list.map(async (chat) => {
          const otherParticipants = chat.participants.filter(p => p !== userId);
          
          let name = "Unknown";
          if (otherParticipants.length > 0) {
            const farmer = await Farmer.findById(otherParticipants[0]);
            name = farmer?.name || "Unknown";
          }
  
          return {
            roomId: chat.roomId,
            lastMessage: chat.lastMessage,
            name,
            participant: otherParticipants[0] || null,
          };
        })
      );
  
      res.json({
        status: "fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

module.exports = {
    getMessages,
    getChatList
}