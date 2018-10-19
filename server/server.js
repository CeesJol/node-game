const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Utils imports
const {Rooms} = require('./utils/rooms');
const {Player} = require('./utils/player');
const {isRealString} = require('./utils/validation');

// Constants
const NUMBER_OF_ROOMS = 1;
const TICKRATE = 1;

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var rooms = new Rooms();

app.use(express.static(publicPath));

// Create number of rooms
for (var i = rooms.rooms.length; i < NUMBER_OF_ROOMS; i++) {

  // Add room with ID the size of the current amount of rooms
  rooms.addRoom(i);
}

io.on('connection', (socket) => {
  console.log('New user connected');

  // Create user
  var me = new Player(socket.id, 0);

  // Add user to a room
  rooms.addPlayer(0, me);

  // Join user to a room
  socket.join(0);

  // Send player info
  socket.emit('playerInfo', me);

  // Player joins a room
  socket.on('join', (data, callback) => {
    // Check if name is valid
    if (!isRealString(data.name)) {
      return callback('A valid user name is required.');
    }

    var player = rooms.getPlayer(socket.id);

    // Set alive property to true
    player.alive = true;

    // Update name
    player.name = data.name;

    // Spawn player
    player.spawn();

    // User did nothing wrong, provide no error
    callback();
  });

  // Player leaves a room
  socket.on('leave', () => {

  });

  // Player requests ping
  socket.on('requestPing', (timestamp) => {
    io.to(socket.id).emit('resultPing', timestamp);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected from server');

    var player = rooms.removePlayer(socket.id);
  });
});

// Update rooms
setInterval(() => {
  rooms.rooms.forEach(function(room)  {
    rooms.getPlayers(room.id).forEach((player) => {
      if (player.alive) {
        io.to(room.id).emit('update', player);
      }
    });
  });
}, 1000 / TICKRATE);

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
