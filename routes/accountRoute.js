const express = require("express");
const accountController = require("../controllers/accountController")
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/farmer", accountController.getFarmerRewards);

module.exports = router;