const express = require('express');
const storageController = require('../controllers/storageController');
const commonController = require('../controllers/commonController');
const upload = require("../middleware/upload"); 

const router = express.Router();

router.get('/nearby', storageController.getInventoriesNearMe);
router.post('/purchase', storageController.buyInventory);
router.put('/purchase/verify', storageController.verifyPurchase);
router.get('/:id', commonController.getInventory);
router.get('/', storageController.getMyInventory);
router.post('/', upload.array("images", 5), storageController.addInventory);

router.put('/', ()=>{});
router.delete('/', ()=>{});

module.exports = router;