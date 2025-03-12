const express = require("express");
const authService = require("../services/authService");
const smsService = require("../services/smsService");

const router = express.Router();

// Define the body and recipient dynamically in the route or hardcode them temporarily
// router.get("/otp", authService.generateOTP);

router.get("/sms", async (req, res) => {
  const body = "Dear customer, OTP to register with FEED4me is 12345. Please enter this code on the login page. Expires in 15 minutes.";
  const to = "+917819977069";

  try {
    await smsService.createMessage(body, to);
    res.status(200).json({ message: "SMS sent successfully!" });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

module.exports = router;
