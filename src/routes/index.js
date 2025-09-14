const { Router } = require('express');
const authRouter = require('./auth');
const registerRouter = require('./register');
const adminRouter = require('./admin');

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/register', registerRouter);

module.exports = router;
