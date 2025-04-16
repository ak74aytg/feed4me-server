const express = require('express')
const cropController = require('../controllers/cropController')

const router = express.Router();

router.get('/all', cropController.getCropList);
router.post('/', cropController.addCropDetails);
router.put('/', ()=>{});
router.delete('/', ()=>{});

module.exports = router;