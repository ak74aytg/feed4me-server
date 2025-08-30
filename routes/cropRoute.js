const express = require('express')
const cropController = require('../controllers/cropController')
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/all', cropController.getCropList);
router.post('/', upload.single("image"), cropController.addCropDetails);
router.put('/', ()=>{});
router.delete('/', ()=>{});

module.exports = router;