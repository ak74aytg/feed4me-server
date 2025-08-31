const express = require('express')
const reviewController = require('../controllers/reviewController')
// const multer = require("multer");

const router = express.Router();

router.post('/', reviewController.createReview);
router.get('/', reviewController.getMyReviews);
router.get('/rating/:inventoryId', reviewController.getRatingsSummary)
router.get('/recent/:inventoryId', reviewController.getRecentReviews)
router.get('/:inventoryId', reviewController.getReviewsForInventory)

module.exports = router;