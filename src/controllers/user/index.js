var express = require('express');
var router = express.Router();
var request = require('request')
var passport = require('passport');
var UserManager = require('../../managers/user');
var userManager = new UserManager();

router.use(require('body-parser').json());
router.use(require('cors')());

// Handle post request from client. Then delegate to method in userManager.
router.post('/chatGetUserInfo', passport.authenticate('facebook-token', {session: false}), function(req, res) {
  userManager.chatGetUserInfo(req.body.userID)
  .then(function(body) {
    res.send(body);
  })
});

// Handle post request from client. Then delegate to method in userManager.
router.post('/chatGetUsersInfo', passport.authenticate('facebook-token', {session: false}), function(req, res) {
  userManager.chatGetUsersInfo(req.body.userID)
  .then(function(body) {
    res.send(body);
  })
});

module.exports = router;

// leave empty line at the end
