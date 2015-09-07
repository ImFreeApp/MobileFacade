var Promise = require("bluebird");
var request = require('request');

function UserManager(){
  this.url = process.env.USER_SERVICES_URL || 'http://localhost:3002';
  //this.url = 'http://localhost:3002';

};

UserManager.prototype.reqUser = function(userToken) {

  return new Promise(function(resolve, reject){

    request.get("https://graph.facebook.com/v2.4/me?"
      + "access_token=" + userToken + "&" +
      "fields=id,name,gender,location,website,picture,likes,email,feed&" +
      "format=json",

      function(err, resp, data){
        console.log(typeof resp.body);
        request.post(
          {
            url: 'http://localhost:3002' + '/api/user/',
            body: {
              "token": userToken,
              "userData": JSON.parse(resp.body)
            },
            json: true
          },
          function(req, userSerivceRes){
            resolve(userSerivceRes);
          }
        );
      }
    )
  })
};


module.exports = UserManager;
