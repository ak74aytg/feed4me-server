const express = require('express');
const storageController = require('../controllers/storageController');
const commonController = require('../controllers/commonController');

const router = express.Router();

router.get('/nearby', storageController.getInventoriesNearMe);
router.post('/purchase', storageController.buyInventory);
router.get('/:id', commonController.getInventory);
router.get('/', storageController.getMyInventory);
router.post('/', storageController.addInventory);
router.put('/', ()=>{});
router.delete('/', ()=>{});

module.exports = router;