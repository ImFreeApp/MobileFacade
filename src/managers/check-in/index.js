var Promise = require("bluebird");
var request = require('request');

function CheckInManager(){
  this.url = process.env.GEO_SERVICES_URL || 'http://localhost:3001/';
};

CheckInManager.prototype.getCheckIns = function(latitude, longitude, distance) {
  var currentUrl = this.url
  return new Promise(function(resolve, reject){
    request.get(currentUrl + '/api/checkin/?latitude=' + latitude + '&longitude=' + longitude + '&distance=' + distance, function(err, resp, body){
      if (err) {
        reject(err);
      }else {
        resolve(body);
      }
    });
  })
};

CheckInManager.prototype.createCheckIn = function(lat, long, activity, userId) {
  console.log('Posting to create checkin at ' + this.url + 'api/checkin/')
  var currentUrl = this.url
  return new Promise(function(resolve, reject){
    request.post(
      {
        url: currentUrl + 'api/checkin/',
        body: {
          latitude: lat,
          longitude: long,
          activity: activity,
          userId: userId
        },
        json: true
      },
      function(req, res){
        // context.res.send(res);
        resolve(res);
        
      }
    );
  })
};

module.exports = CheckInManager;