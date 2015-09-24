var Promise = require("bluebird");
var request = require('request');

function UserManager(){
  if(process.env.USERSERVICES_PORT_3002_TCP_ADDR) {
    this.url = 'http://'+process.env.USERSERVICES_PORT_3002_TCP_ADDR+':3002';
  } else {
    this.url = process.env.USER_SERVICES_URL || 'http://localhost:3002';
  }
};

UserManager.prototype.reqUser = function(userToken) {
  var currentURL = this.url;

  return new Promise(function(resolve, reject){

    request.get("https://graph.facebook.com/v2.4/me?"
      + "access_token=" + userToken + "&" +
      "fields=id,name,gender,location,website,picture.type(large),birthday,likes,email,feed&" +
      "format=json",
      function(err, resp, data){

        if(err) reject(err);
        else{
          request.post(
            {
              url: currentURL + '/api/user/',
              body: {
                "token": userToken,
                "userData": JSON.parse(resp.body)
              },
              json: true
            },
            function(err, userSerivceRes,body){
              if(err) reject(err);
              else resolve(userSerivceRes);
            }
          );
        }
      }
    )
  })
};

UserManager.prototype.reqUserServices = function(userIndex, fn){
  request.get(this.url + userIndex, function(err, res, userbody){
    fn(err, res, userbody);
  })
};


UserManager.prototype.chatGetUserInfo = function(userID) {
  var currentUrl = this.url;
  return new Promise(function(resolve, reject) {
    request.post( 
    {
      url: currentUrl + '/api/user/chatGetUserInfo/',
      body: {
        userID: userID
      },
      json: true
    }, 
    function(err, resp, body) {
      if(err) {
        reject(err);

      } else {
        // console.log('body inside chatGetUserInfo:', body);
        resolve(body);
      }
    });
  })
};

UserManager.prototype.chatGetUsersInfo = function(userID) {
  // console.log('inside userManager index.js');
  // console.log('requesting info for userID:', userID);
  var currentUrl = this.url;
  return new Promise(function(resolve, reject) {
    request.post( 
    {
      url: currentUrl + '/api/user/chatGetUsersInfo/',
      body: {
        userID: userID
      },
      json: true
    }, 
    function(err, resp, body) {
      if(err) {
        reject(err);

      } else {
        // console.log('body inside chatGetUserInfo:', body);
        resolve(body);
      }
    });
  })
};

module.exports = UserManager;

// leave extra line at end
