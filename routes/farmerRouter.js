const express = require('express');
const farmerController = require('../controllers/farmerController');

const router = express.Router();

router.get('/', farmerController.getAllFarmersController);
router.get('/me', farmerController.getMyProfile);
router.get('/news', farmerController.getNews);
router.get('/news/recent', farmerController.getRecentNews);
router.put('/', farmerController.updateInfo);
router.post('/inventory/add', farmerController.addInventory);
router.get('/customers', farmerController.getMyCustomers);
router.get('/:parameter', farmerController.getFarmerController);

module.exports = router;