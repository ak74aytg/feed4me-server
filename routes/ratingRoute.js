const express = require('express')
const reviewController = require('../controllers/reviewController')
// const multer = require("multer");

const router = express.Router();

router.post('/', reviewController.createRating);
router.get('/', reviewController.getMyRating);
router.get('/:inventoryId', reviewController.getRatingsForInventory)

module.exports = router;