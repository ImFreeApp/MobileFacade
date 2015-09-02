var Promise = require("bluebird");
var request = require('request');

function CheckInManager(){
  this.url = process.env.GEO_SERVICES_URL || 'http://localhost:3001';
};

CheckInManager.prototype.getCheckIns = function(latitude, longitude, distance) {
  return new Promise(function(resolve, reject){
    request.get(this.url + '/api/checkin/?latitude=' + lat + '&longitude=' + long + '&distance=' + distance, function(err, resp, body){
      if (err) {
        reject(err);
      } else if(resp.status != '200'){
        reject(new Error('status code:',resp.status));
      }else {
        resolve(body);
      }
    });
  })
};

CheckInManager.prototype.createCheckIn = function(lat, long, activity, userId) {
  return new Promise(function(resolve, reject){
    request.post(
      {
        url: this.url + '/api/checkin/',
        json: {
          latitude: lat,
          longitude: long,
          activity: activity,
          userId: userId
        }
      },
      function(req, res){
        // context.res.send(res);
        resolve(res);
        
      }
    );
  })
};

module.exports = CheckInManager;