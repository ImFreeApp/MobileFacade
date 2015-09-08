var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var UserManager = require('../../managers/user');
var userManager = new UserManager();
router.use(passport.initialize());

router.use(require('body-parser').json());
router.use(require('cors')());

router.post('/facebook', passport.authenticate('facebook-token', { session: false }) ,function (req, res) {
  // do something with req.user 
  res.send({name: req.user.name, fbId: req.user.fbId, pic: req.user.picture});
});


router.post('/twitter', function(req,res){ 
  res.send('twitter');

});

module.exports = router;