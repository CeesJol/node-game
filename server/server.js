console.log('Starting server...');

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Utils imports
const {Rooms} = require('./utils/rooms');
const {Player} = require('./utils/player');
const {isRealString, pyth} = require('./utils/general');

// Constants
const NUMBER_OF_ROOMS = 2;
const TICKRATE = 32;
const MAX_USERNAME_LENGTH = 10;

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var rooms = new Rooms();

app.use(express.static(publicPath));

// Create number of rooms
for (var i = rooms.rooms.length; i < NUMBER_OF_ROOMS; i++) {
  var room = rooms.addRoom();

  rooms.spawnPellet(room.id);

  console.log('Created new room with id ' + room.id);
}

io.on('connection', (socket) => {
  console.log('New user connected');

  // Find best room
  var room = rooms.findBestRoom();

  // Create user
  var me = new Player(socket.id, room.id, room.size);

  // Add user to a room
  rooms.addPlayer(room.id, me);

  // Join user to a room
  socket.join(room.id);

  // Send player info
  socket.emit('playerInfo', me);

  // Send general info
  socket.emit('info', {
    MAX_USERNAME_LENGTH
  });

  // Player joins a room
  socket.on('join', (data, callback) => {
    // Check if name is valid
    if (!isRealString(data.name)) {
      return callback('A valid user name is required.');
    } else if (data.name.length > MAX_USERNAME_LENGTH) {
      return callback('User name is too long. (max 10 characters)');
    }

    var player = rooms.getPlayer(socket.id);

    // Set alive property to true
    player.alive = true;

    // Update name
    player.name = data.name;

    // Spawn player
    rooms.spawnPlayer(player);

    // User did nothing wrong, provide no error
    callback();
  });

  // Player leaves a room
  socket.on('leave', () => {

  });

  // Player requests ping
  socket.on('requestPing', (timestamp) => {
    io.to(socket.id).emit('resultPing', timestamp);
  });

  // Player moves
  // data: dx, dy
  socket.on('movement', (data) => {
    var player = rooms.getPlayer(socket.id);
    var room = rooms.getRoom(player.room.id);

    player.x += data.dx;
    player.y += data.dy;

    // Within border check
    if (player.x < player.size) {
      player.x = player.size;
    } else if (player.x > room.size - player.size) {
      player.x = room.size - player.size;
    }
    if (player.y < player.size) {
      player.y = player.size;
    } else if (player.y > room.size - player.size) {
      player.y = room.size - player.size;
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from server');

    var player = rooms.removePlayer(socket.id);
  });
});

// Update rooms
setInterval(() => {
  rooms.rooms.forEach(function(room)  {
    for(var player of rooms.getAlivePlayers(room.id)) {
      // Check for player / pellet interaction
      for (var pellet of rooms.getPellets(room.id)) {
        if (pyth(player.x - pellet.x, player.y - pellet.y) <= player.size + pellet.size) {
          rooms.eatPellet(player, pellet);
        }
      }

      // Check for player / player interaction
      // ...
    }

    // Send players and pellets
    io.to(room.id).emit('update', {
      players: rooms.getAlivePlayers(room.id),
      pellets: rooms.getPellets(room.id)
    });
  });
}, 1000 / TICKRATE);

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
