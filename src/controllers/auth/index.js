var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var UserManager = require('../../managers/user');
var userManager = new UserManager();
router.use(passport.initialize());

options = {
  clientID: process.env.FACEBOOK_APP_ID || "840774716036629",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "d018e4926746117d64546bed6bc4e06b"
}

// Set up a local strategy session.
// TODO: Memcache for multiple users
passport.use(new FacebookTokenStrategy({
    clientID: options.clientID,
    clientSecret: options.clientSecret
  },

  function(accessToken, refreshToken, profile, done) {
    console.log('AUTH USER');
    userManager.reqUser(accessToken)
      .then(function(user){
        done(null, user.body);
      })
      .catch(function(err){
        done(err, null);
      })
  }

));


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