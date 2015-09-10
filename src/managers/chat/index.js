var Promise = require("bluebird");
var request = require('request');

function ChatManager(){
  // Define the appropriate process environment url
  if(process.env.CHATSERVICES_PORT_3003_TCP_ADDR) {
      this.url = 'http://'+process.env.CHATSERVICES_PORT_3003_TCP_ADDR+':3003';
  } else {
    this.url = process.env.CHAT_SERVICES_URL || 'http://localhost:3003';
  } 
};

// Makes post request to chat database to retrieve all chats of a user
ChatManager.prototype.getUserChats = function(userId) {
  var currentUrl = this.url;
  return new Promise(function(resolve, reject) {
    request.post(
      {
        url: currentUrl + '/api/userChats/getAllUserChats/',
        body: {
          userId: userId
        },
        json: true
      },
      function(err, resp, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  })
};

// Makes post request to chat database to retrieve chat conversations given a (or a list of) chatID/s
ChatManager.prototype.getChatDetails = function(chatIDs) {
  var currentUrl = this.url;
  return new Promise(function(resolve, reject) {
    request.post({
      url: currentUrl + '/api/chat/getChatDetails/', 
      body: {
        chatIDs: chatIDs
      },
      json: true
    },
    function(err, resp, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  })
};

module.exports = ChatManager;

// leave extra line at the end
