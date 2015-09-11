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

// Handle post request from client. Then delegate to method in checkInManager.
router.post('/addcheckin', passport.authenticate('facebook-token', { session: false }),  function(req, res){
  checkInManager.createCheckIn(req.body.latitude, req.body.longitude, req.body.activity, req.body.userId)
  .then(function(checkinRes){
    res.sendStatus(201);
  })
  .catch(function(err){
    console.error(err);
  });
})

// Handle post request from client. Then delegate to method in checkInManager.
router.post('/getcheckin', passport.authenticate('facebook-token', { session: false }), function(req, res){
  checkInManager.getCheckIns(req.query.latitude, req.query.longitude, req.query.distance)
  .then(function(body){
    var dataBody = JSON.parse(body);
    var results = [];
    var userRes = res;

    // Recursion function to continue waiting for response until all responses have been received.
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
});

// Helper function to re-define user data format
var prettifyData = function(data, userBody){
  var userData = JSON.parse(userBody);
  if(!userData.likes) {
    return null;
  }
  if (!userData.likes.data || !data.geo[0] || !data.geo[1] || !userData.picture.data.url || !userData.name)
    return null;
  var obj = {};
  obj.activities = data.activity;
  obj.id = data.userId;
  obj.lat = data.geo[1];
  obj.long = data.geo[0];
  obj.profilePic = userData.picture.data.url;
  obj.username = userData.name;
  var user_birthday = userData.birthday;
  var user_birthmonth = user_birthday.slice(0,2);
  var user_birthdate = user_birthday.slice(3,5);
  var user_birthyear = user_birthday.slice(6);
  obj.userAge = calculate_age(user_birthmonth, user_birthdate, user_birthyear); 
  var likesArray = [];
  for (var key in userData.likes.data) {
    likesArray.push(userData.likes.data[key].name);
  }
  obj.likes = likesArray;
  obj.likesTopThree = obj.likes.slice(0 ,3);
  return obj;
}

// Helper function to calculate age of user
calculate_age = function(birth_month,birth_day,birth_year) {
  today_date = new Date();
  today_year = today_date.getFullYear();
  today_month = today_date.getMonth();
  today_day = today_date.getDate();
  age = today_year - birth_year;
  if ( today_month < (birth_month - 1))
  {
      age--;
  }
  if (((birth_month - 1) == today_month) && (today_day < birth_day))
  {
      age--;
  }
  return age;
}

module.exports = router;

// leave empty line at end
