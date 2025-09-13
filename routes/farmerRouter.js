const express = require('express');
const farmerController = require('../controllers/farmerController');
const accountController = require('../controllers/accountController')

const router = express.Router();

router.get('/', farmerController.getAllFarmersController);
router.put('/', farmerController.updateInfo);
router.get('/coins', farmerController.getMyCoins);
router.get('/transaction', farmerController.getMyTransactions);
router.post('/transaction/:transaction_id', accountController.verifyTransaction);
router.get('/inventory', farmerController.getPurchasedInventory);
router.get('/me', farmerController.getMyProfile);
router.put('/edit/location', farmerController.updateLocation)
router.get('/news', farmerController.getNews);
router.get('/news/recent', farmerController.getRecentNews);
router.post('/inventory/add', farmerController.addInventory);
router.get('/customers', farmerController.getMyCustomers);
router.get('/:parameter', farmerController.getFarmerController);

module.exports = router;