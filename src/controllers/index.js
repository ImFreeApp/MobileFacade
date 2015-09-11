var express = require('express');
var router = express.Router();

router.use('/auth', require("./auth"));
router.use('/checkin', require('./check-in'));
router.use('/chat', require('./chat'));
router.use('/user', require('./user'));

// console.log('router inside index.js root:', router)
console.log('inside index.js root');

module.exports = router;