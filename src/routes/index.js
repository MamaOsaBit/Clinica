const { Router} = require('express');
const authRouter = require('./auth');
const registerRouter = require('./registerRoutes');

const router = Router();

router.use('/auth', authRouter);
router.use('/register', registerRouter);

module.exports = router;
