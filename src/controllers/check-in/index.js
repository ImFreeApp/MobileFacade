var CheckInManager = require('../../managers/check-in');
var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var checkInManager = new CheckInManager();

router.use(require('body-parser').json());
router.use(require('cors')());


router.post('/addcheckin', passport.authenticate('facebook-token', { session: false }),  function(req, res){
  console.log(req.body);
  console.log(CheckInManager);
  checkInManager.createCheckIn(req.body.latitude, req.body.longitude, req.body.activity, req.body.userId)
  .then(function(checkinRes){
    res.sendStatus(201);
  });

})

router.post('/getcheckin', passport.authenticate('facebook-token', { session: false }), function(req, res){
  checkInManager.getCheckIns(req.query.latitude, req.query.longitude, req.query.distance)
  .then(function(body){

    var dataBody = JSON.parse(body);
    var results = [];
    var userRes = res;

    var recurseCheck = function(index){

      if (!dataBody[index]) {
        userRes.send(results);
        return;
      }

      request.get('http://localhost:3002/api/user/' + dataBody[index].userId, function(err, res, userBody){


        if (req.query.currentFbId !== dataBody[index].userId){
          console.log(dataBody[index]);
          results.push(prettifyData(dataBody[index], userBody));
          recurseCheck(index+=1);
        } else {
          console.log('SAME ID >>>>>> SKIPPING')
          recurseCheck(index+=1);
        }


      })
    }

    recurseCheck(0);
  });

})

var prettifyData = function(data, userBody){
  var obj = {};
  obj.activities = data.activity;
  obj.id = data.userId;
  var userData = JSON.parse(userBody);
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

