const router = require('express').Router();

router.use('/users', require('./userRoutes'));

router.use('/auth', require('./authRoutes'));

router.use('/files', require('./uploadRoutes'));

module.exports = router;