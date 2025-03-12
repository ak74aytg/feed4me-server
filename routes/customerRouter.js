const express = require('express');

const router = express.Router();

//get all customers
router.get('/customers', ()=>{});
//get specific customer
router.get('/customers/:id', ()=>{});
//get my profile
router.get('/customers/me', ()=>{});
//edit my profile
router.put('/customer', ()=>{});

module.exports = router;