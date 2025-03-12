const express = require('express');
const farmerController = require('../controllers/farmerController');

const router = express.Router();

router.get('/', farmerController.getAllFarmersController);
router.get('/me', farmerController.getMyProfile);
router.get('/:parameter', farmerController.getFarmerController);
router.put('/', farmerController.updateInfo);

module.exports = router;