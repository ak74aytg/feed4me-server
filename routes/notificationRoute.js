const notificationController = require("../controllers/notificationController")
const express = require('express')

const router = express.Router()

router.get('/farmer', notificationController.getFarmerNotifications)
router.put('/farmer/mark_read', notificationController.markAsRead)

module.exports = router;