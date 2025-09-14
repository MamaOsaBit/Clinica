const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.get('/login', loginController.loginForm);
router.post('/login', loginController.handleLogin);
router.post('/api/login', loginController.handleLogin);

module.exports = router;
