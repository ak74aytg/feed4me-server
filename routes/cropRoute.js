const express = require('express')
const cropController = require('../controllers/cropController')
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/all', cropController.getCropList);
router.post('/', upload.array("images", 5), cropController.addCropDetails);
router.put('/', ()=>{});
router.delete('/', ()=>{});

module.exports = router;