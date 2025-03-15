const express = require('express');
const storageController = require('../controllers/storageController');

const router = express.Router();

router.get('/nearby', storageController.getInventoriesNearMe);
router.post('/purchase', storageController.buyInventory);
router.get('/', storageController.getMyInventory);
router.post('/', storageController.addInventory);
router.put('/', ()=>{});
router.delete('/', ()=>{});

module.exports = router;