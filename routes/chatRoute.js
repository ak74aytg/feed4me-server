const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.get('/chats/:userId', chatController.getChatList)
router.get('/:chatId', chatController.getMessages);


module.exports = router;