const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post('/:role/register/initiate', authController.initialRegisterController);
router.post('/:role/register/verify', authController.verifyRegisterController);
router.post('/:role/login', authController.loginController);
router.delete('/:role/delete', authController.deleteController)

module.exports = router;