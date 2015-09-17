var CheckInManager = require('../../managers/check-in');
var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var checkInManager = new CheckInManager();
var UserManager = require('../../managers/user');
var userManager = new UserManager();

router.use(require('body-parser').json());
router.use(require('cors')());


router.post('/addcheckin', passport.authenticate('facebook-token', { session: false }),  function(req, res){
  console.log(req.body);
  console.log(CheckInManager);
  checkInManager.createCheckIn(req.body.latitude, req.body.longitude, req.body.activity, req.body.userId)
  .then(function(checkinRes){
    res.sendStatus(201);
  })
  .catch(function(err){
    console.error(err);
  });

})

router.post('/getcheckin', passport.authenticate('facebook-token', { session: false }), function(req, res){
  checkInManager.getCheckIns(req.query.latitude, req.query.longitude, req.query.distance)
  .then(function(body){

    // FB response with a bunch of users
    var dataBody = JSON.parse(body);
    // Empty results array
    var results = [];
    // 
    var userRes = res;

    var recurseCheck = function(index){

      if (!dataBody[index]) {
        userRes.send(results);
        return;
      }

      var newErr = function(){
        userRes.sendStatus(500);
        return;
      }

      userManager.reqUserServices(dataBody[index].userId, function(err, res, userBody){


        if (req.query.currentFbId !== dataBody[index].userId){
          var pretty = prettifyData(dataBody[index], userBody);
          if (!pretty) {
            newErr();
            return;
          }
          results.push(pretty);
          recurseCheck(index+=1);
        } else {
          recurseCheck(index+=1);
        }


      });



    }

    recurseCheck(0);
  });

})

var prettifyData = function(data, userBody){
  var userData = JSON.parse(userBody);

  if (!userData.likes.data || !data.geo[0] || !data.geo[1] || !userData.picture.data.url || !userData.name)
    return null;

  var obj = {};
  obj.activities = data.activity;
  obj.id = data.userId;
  obj.lat = data.geo[1];
  obj.long = data.geo[0];

  obj.profilePic = userData.picture.data.url;
  obj.username = userData.name;

  var likesArray = [];
  for (var key in userData.likes.data) {
    likesArray.push(userData.likes.data[key].name);
  }

  obj.likes = likesArray;

  obj.likesTopThree = obj.likes.slice(0 ,3);

  return obj;
}

module.exports = router;

