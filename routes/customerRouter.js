const express = require('express');
const customerController = require("../controllers/customerController")
const upload = require("../middleware/upload"); 

const router = express.Router();

//get all customers
router.post(
  "/inventory/add",
  upload.array("images", 5),
  customerController.addInventory
);
router.post('/crop/buy', customerController.buyCrops);
//get specific customer
router.get('/:id', ()=>{});
//get my profile
router.get('/me', ()=>{});
//edit my profile
router.put('', ()=>{});

module.exports = router;