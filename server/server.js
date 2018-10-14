const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {player} = require('./player.js');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// A new user has connected
io.on('connection', (socket) => {
  // Print a message in the server log
  console.log('New user connected');

  // Send a message to connected user
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // Send a message to all connected users
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // LISTENER for messages sent by users
  socket.on('createMessage', (message, callback) => {
    // Print a message in the server log
    console.log('createMessage', message);

    // Send the message to all users
    io.emit('newMessage', generateMessage(message.from, message.text));

    // Callback (?)
    callback('This is from the server.');
  });

  // LISTENER for users disconnecting
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

// Create server
server.listen(port, () => {
  console.log(`Server is up on ${port}`);

  // var cees = new player('Cees');
  // cees.printName();
});





var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
