const express = require('express');
const registerController = require('../controllers/registerController');
const router = express.Router();

router.get('/register', registerController.registerForm);
router.post('/register', registerController.handleRegister);

module.exports = router;
