const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", paymentController.createNewOrder);
router.post("/verify-payment", paymentController.verifyPayment);

module.exports = router;