var express = require('express');
var router = express.Router();
var request = require('request')
var passport = require('passport');
var ChatManager = require('../../managers/chat');
var chatManager = new ChatManager();

router.use(require('body-parser').json());
router.use(require('cors')());

// Handle post request from client. Then delegate to chatManager method.
router.post('/getUserChats', passport.authenticate('facebook-token', {session: false }), function(req, res) {
  chatManager.getUserChats(req.user.fbId)
  .then(function(body) {
    res.send(body);
  });
});

// Handle post request from client. Then delegate to chatManager method.
router.post('/getChatDetails', passport.authenticate('facebook-token', {session:false}), function(req, res) {
  chatManager.getChatDetails(req.body.chatIDs) 
  .then(function(body) {
    res.send(body);
  })
})

module.exports = router;

// leave empty line at end
