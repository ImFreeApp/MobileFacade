var Promise = require("bluebird");
var request = require('request');

function UserManager(){
  if(process.env.USERSERVICES_PORT_3002_TCP_ADDR) this.url = 'http://'+process.env.USERSERVICES_PORT_3002_TCP_ADDR+':3002';
  else this.url = process.env.USER_SERVICES_URL || 'http://localhost:3002';
  //this.url = 'http://localhost:3002';

};

UserManager.prototype.reqUser = function(userToken) {
  var currentURL = this.url;

  return new Promise(function(resolve, reject){

    request.get("https://graph.facebook.com/v2.4/me?"
      + "access_token=" + userToken + "&" +
      "fields=id,name,gender,location,website,picture,likes,email,feed&" +
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
            function(req, userSerivceRes,err){
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
}


module.exports = UserManager;
