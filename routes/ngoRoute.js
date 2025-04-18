const express = require("express");
const ngoController = require("../controllers/ngoController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", ngoController.getNearbyNgos);
router.post("/donate", upload.single("image"), ngoController.donateWaste);
router.get("/donations", ngoController.getDonations)
router.put("/update", ngoController.updateStatus)

module.exports = router;