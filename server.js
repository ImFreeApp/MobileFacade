var express = require('express');
var app = express();
var passport = require('passport');
var UserManager = require('./src/managers/user');
var userManager = new UserManager();
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var process = require('./config');

app.use('/api/', require('./src/controllers'));

// Set process env Facebook ID and secret in config.js 
var options = {
  clientID: process.env.FACEBOOK_APP_ID, 
  clientSecret: process.env.FACEBOOK_APP_SECRET 
}

// Set up a local strategy session for FB authentication
passport.use(new FacebookTokenStrategy({
    clientID: options.clientID,
    clientSecret: options.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    userManager.reqUser(accessToken)
      .then(function(user){
        done(null, user.body);
      })
      .catch(function(err){
        done(err, null);
      })
  }
));

// Define port
var port = process.env.PORT || 3000;

// Listens to server
var server = http.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('MobileFacade listening at http://%s:%s', host, port);
});

// Define users object to store users when they connec to socket
var users = users || {};

// Setup the socket connection to communicate with mobile client
io.on('connection', function (socket) {

  // Listens for event. Event sending user has created a public chat, therefore updating all participants' localStorage publicChat. 
  socket.on('update other user public chat storage', function(chatID, userID) {
    for (var i = 0 ; i < userID.length; i++) {
      var key = usersID[i];
      users[key].emit('update user public chat storage', chatID, function(data) {
      });        
    }
  });

  // Update the chat participant storage in all chat participants to reflect that a new user has been added to a chat
  socket.on('added new user to chat', function(
    data, 
    currentUser
    ) {
    for (var key in data) {
      if(key !== currentUser) {
        users[key].emit('chat participant updates', data, function(data) {
        });
      }
    }
  });

  // Tell all participant users to update conversation storage inside localStorage
  socket.on('tell other user to update localStorage messages', function(receiverIDs) {
    for (var key in receiverIDs) {
      if(users[key]) {
        users[key].emit('update localStorage messages', function() {
        });                    
      } else {
        console.log('user not found in users object');
      }
    }
  });

  // Update the receiving user's private chat storage upon initiating a private chat with receiving user (to prevent duplication of private chat creation)
  socket.on('update other user private chat storage', function(receiverID, chatID, senderID) {
    if(users[receiverID]) {
      users[receiverID].emit('receiving changes to private chat storage', chatID, senderID, function(data) {
      });
    } else {
      console.log('receiver cannot be found in user storage');
    }
  });

  // Saves user to users object upon log on
  socket.on('new user logged on', function(data, callback) {
    if (data in users){
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
    }
  });

  // Sends message to all receiving users (can be for private chat or public chat)
  socket.on('send message', function(data, participantUserIDs, callback) {
    data.message = data.message.trim();
    var senderId = data.senderId;
    for (var key in participantUserIDs) {
      if(users[key] && key !== senderId) {
        users[key].emit('receive new message', data, function(data) {
        });                    
      } else {
        console.log('either receivingUser is offline or currently evaluating senderID');
      }
    }
  });

  // Listens for socket disconnect events 
  socket.on('disconnect', function () {
    console.log('socket disconnected');
  });
});

module.exports = app;

// leave extra line at end
