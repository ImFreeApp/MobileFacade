var express = require('express');
var router = express.Router();

// re-routes requests from mobile client
router.use('/auth', require("./auth"));
router.use('/checkin', require('./check-in'));
router.use('/chat', require('./chat'));
router.use('/user', require('./user'));

module.exports = router;

// leave empty line at the end
