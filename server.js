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

var options = {
  clientID: process.env.FACEBOOK_APP_ID, 
  clientSecret: process.env.FACEBOOK_APP_SECRET 
}

// Set up a local strategy session.
// TODO: Memcache for multiple users
passport.use(new FacebookTokenStrategy({
    clientID: options.clientID,
    clientSecret: options.clientSecret
  },

  function(accessToken, refreshToken, profile, done) {
    console.log('clientId', options.clientID);
    console.log('clientSecret', options.clientSecret);
    console.log('AUTH USER');
    userManager.reqUser(accessToken)
      .then(function(user){
        done(null, user.body);
      })
      .catch(function(err){
        done(err, null);
      })
  }

));

var port = process.env.PORT || 3000;

var server = http.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(server.address());
  console.log('MobileFacade listening at http://%s:%s', host, port);
});

var users = users || {};

io.on('connection', function (socket) {
    console.log('socket connected');
    socket.emit('news', { hello: 'world' });

    socket.on('update other user public chat storage', function(chatID, userID) {
      for (var i = 0 ; i < userID.length; i++) {
        var key = usersID[i];
        users[key].emit('update user public chat storage', chatID, function(data) {
          console.log('.emit update user public chat storage');
          console.log('chatID:',chatID, ' userID:', userID);
          console.log(data)
        })        
      }
    })

    socket.on('added new user to chat', function(
      data, 
      currentUser
      ) {
      for (var key in data) {
        if(key !== currentUser) {
          users[key].emit('chat participant updates', data, function(data) {
            console.log('emit "chat participant updates"')
          })          
        }
      }
    })

    socket.on('tell other user to update localStorage messages', function(receiverIDs) {
      console.log('********************receiverIDs:', receiverIDs);
      for (var key in receiverIDs) {
        console.log('should be a userID',key);
        // console.log('senderId', senderId);
        console.log('about to tell other user to update localStorage');
        console.log('this should be true:', typeof users[key], ', key:', key);
        if(users[key]) {
          console.log('user does exist in key, and the user is other than the sender. next function tells user tou update');
          users[key].emit('update localStorage messages', function() {

            console.log('emit to key:', key);
          });                    
          console.log('emitted to other user to update localStorage')
        } else {
          console.log('user not found in users object');
        }
      }
    });

    socket.on('update other user private chat storage', function(receiverID, chatID, senderID) {
      console.log("**********************************socket.on 'update other user private chat storage'");
      console.log('receiverID:', receiverID);
      console.log('chatID:',chatID);
      console.log('senderID:', senderID);
      if(users[receiverID]) {
        console.log('------------------------------&&&&&&&&&&&&&&&&&&&&: about to emit to change private chat storage')
        users[receiverID].emit('receiving changes to private chat storage', chatID, senderID, function(data) {
          console.log("socket emit 'receiving changes to private chat storage'");
        })
        console.log('emitted to change private chat storage');
        
      } else {
        console.log('receiver offline');
      }
    })


    // test code
    socket.on('my other event', function (data) {
        console.log('should say world', data);
      });
    // console.log('--------------------->socket,', socket);

    socket.on('new user logged on', function(data, callback) {
      console.log('#####################################################################')
      // console.log('------------------------>data,', data);

      if (data in users){
        callback(false);
      } else {
        callback(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        // updateNicknames();
      }
      // console.log('---------------->users',users);
    });

    socket.on('send message', function(data, participantUserIDs, callback) {
      console.log('.on "send message" in MobileFacade server.js')
      data.message = data.message.trim();
      var senderId = data.senderId;
      console.log('senderId', senderId);
      for (var key in users) {
        console.log('key in users:', key);
      }
      console.log('&&&&&&&&&&&&&&&&&&&participantUserIDs', participantUserIDs)
      for (var key in participantUserIDs) {
        console.log('should be a userID',key);
        console.log('senderId', senderId);
        console.log('about to emit a message');
        console.log('this should be true:', typeof users[key], ', key:', key);
        if(users[key] && key !== senderId) {
          console.log('user does exist in key, and the user is other than the sender. next function emits message');
          users[key].emit('receive new message', data, function(data) {

            console.log('**************************************************.emit to ', key);
          });                    
          console.log('message emitted')
        } else {
          console.log('either user is offline or trying to send to sender');
        }
      }
    });


    socket.on('user login', function(data) {
      console.log('socket.on user login')
    })

    socket.on('helloServer', function(data) {
      socket.emit('helloClient')
      console.log('client said hello to server');
    })

    socket.on('clicked on twitter', function() {
      console.log('user pressed on twitter');
      socket.emit('twitter listener');
    });

    socket.on('disconnect', function () {
      console.log('socket disconnected');
    });



    // socket.emit('text', 'wow. such event. very real time.');
});


module.exports = app;



