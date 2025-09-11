const express = require('express');
const farmerController = require('../controllers/farmerController');

const router = express.Router();

router.get('/', farmerController.getAllFarmersController);
router.put('/', farmerController.updateInfo);
router.get('/coins', farmerController.getMyCoins);
router.get('/transaction', farmerController.getMyTransactions);
router.get('/inventory', farmerController.getPurchasedInventory);
router.get('/me', farmerController.getMyProfile);
router.put('/edit/location', farmerController.updateLocation)
router.get('/news', farmerController.getNews);
router.get('/news/recent', farmerController.getRecentNews);
router.post('/inventory/add', farmerController.addInventory);
router.get('/customers', farmerController.getMyCustomers);
router.get('/:parameter', farmerController.getFarmerController);

module.exports = router;