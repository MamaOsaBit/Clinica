const { Router} = require('express');
const authRouter = require('./auth');
const registerRouter = require('./registerRoutes');
const adminRouter = require('./adminRoutes');

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/register', registerRouter);

module.exports = router;
