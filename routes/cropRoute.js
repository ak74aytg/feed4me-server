const express = require('express')
const cropController = require('../controllers/cropController')

const router = express.Router();

router.get('/', ()=>{});
router.post('/', cropController.addCropDetails);
router.put('/', ()=>{});
router.delete('/', ()=>{});

module.exports = router;