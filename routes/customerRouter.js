const express = require('express');
const customerController = require("../controllers/customerController")

const router = express.Router();

//get all customers
router.post('/inventory/add', customerController.addInventory);
router.post('/crop/buy', customerController.buyCrops);
//get specific customer
router.get('/:id', ()=>{});
//get my profile
router.get('/me', ()=>{});
//edit my profile
router.put('', ()=>{});

module.exports = router;