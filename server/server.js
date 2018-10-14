const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Player} = require('./player.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// Create server
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

var players = {};
var ping = -1;

var clients = [];

// A new user has connected
io.on('connection', function(socket) {
  clients.push(socket.id);

  // LISTENER for users connecting
  socket.on('new player', function() {
    players[socket.id] = new Player(300, 300, 'Cees');

    console.log('Player ' + (players[socket.id]).name + ' has joined the game!');
  });

  // LISTENER for users disconnecting
  socket.on('disconnect', function() {
    var player = players[socket.id] || {};
    console.log('Player ' + player.name + ' has left the game.');

    // remove disconnected player
    delete players[socket.id];
  });

  // LISTENER for movement of players
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

  // LISTENER for requestPing
  socket.on('requestPing', function(data) {
    var player = players[socket.id] || {};
    player.ping = data;
    io.sockets.to(socket.id).emit('pingResult', data);
  })
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
