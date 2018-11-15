console.log('Starting server...');

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Utils imports
const {Rooms} = require('./utils/rooms');
const {Player} = require('./utils/player');
const {isRealString, pyth, collision, evaporate} = require('./utils/general');

// Constants
const NUMBER_OF_ROOMS = 2;
const TICKRATE = 32;
const EVAP_TICKRATE = 1;
const MAX_USERNAME_LENGTH = 10;

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var rooms = new Rooms();

// Store whether server is up
var up = false;

// For every tick, store the pellets that were eaten and created
var eatenPellets = [],
    newPellets = []

app.use(express.static(publicPath));

// Create number of rooms
for (var i = rooms.rooms.length; i < NUMBER_OF_ROOMS; i++) {
  var room = rooms.addRoom();
}

// Rooms have been created :)
up = true;

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
  socket.emit('playerInfo', {me, room} );

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

    if (!player) return;

    var room = rooms.getRoom(player.room.id);

    // Make sure data is normalized
    var sum = Math.abs(data.dx) + Math.abs(data.dy);
    data.dx = (data.dx / sum) * player.speed;
    data.dy = (data.dy / sum) * player.speed;

    player.dx = data.dx;
    player.dy = data.dy;

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

  // Player sends mass
  socket.on('sendMassRequest', () => {
    var player = rooms.getPlayer(socket.id);

    // TODO implement minimum size
    if (player.size > 0) {
      // Add mass object to map
      var mass = rooms.spawnMass(player.room.id, player.x + player.dx * player.size, player.y + player.dy * player.size, player.dx, player.dy, player.color);

      // Remove mass from player
      player.size = Math.sqrt(Math.pow(player.size, 2) - Math.pow(mass.size, 2));
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from server');

    var player = rooms.removePlayer(socket.id);
  });
});

// Update rooms
setInterval(() => {
  if (!up) return false;

  rooms.rooms.forEach(function(room)  {
    // Clean up eaten and new pellets
    eatenPellets = [];
    newPellets = [];

    var players = rooms.getAlivePlayers(room.id);
    var pellets = rooms.getPellets(room.id);
    var masses = rooms.getMasses(room.id);

    // Update all players
    for (var i = 0; i < players.length; i++) {
      var player = players[i];

      // Check for player / player interaction
      for (var j = i + 1; j < players.length; j++) {
        var ply = players[j];

        // Check for collision between the two players
        if (collision(player, ply)) {

          // If one player is smaller, this player will die
          // Otherwise, nothing happens :)
          // TODO implement threshold between the two player sizes
          if (player.size < ply.size) {
            ply.size = pyth(player.size, ply.size);
            rooms.kill(player);
            io.to(player.id).emit('died');
          } else if (player.size > ply.size) {
            player.size = pyth(player.size, ply.size);
            rooms.kill(ply);
            io.to(ply.id).emit('died');
          }
        }
      }

      // Check for player / pellet interaction
      for (var pellet of pellets) {

        // Check for collision between two blobs: player and pellet
        if (collision(player, pellet)) {

          // Player eats the pellet
          eatenPellets.push(pellet);
          newPellets.push(rooms.eatPellet(player, pellet));
        }
      }

      // Check for player / mass interaction
      for (var mass of masses) {

        // Check for collision between two blobs: player and mass
        if (collision(player, mass)) {

          // Player eats the mass
          // TODO only eat mass if big enough? is this a thing?
          // TODO make this a method in general.js
          player.size = pyth(player.size, mass.size);

          var index = masses.indexOf(mass);
          if (index > -1) {
            masses.splice(index, 1);
          }

        }
      }
    }

    // Update all masses
    for (var mass of masses) {
      mass.x += mass.dx;
      mass.y += mass.dy;

      // Within border check
      // TODO also implement this locally?
      if (mass.x < mass.size) {
        mass.x = mass.size;
      } else if (mass.x > room.size - mass.size) {
        mass.x = room.size - mass.size;
      }
      if (mass.y < mass.size) {
        mass.y = mass.size;
      } else if (mass.y > room.size - mass.size) {
        mass.y = room.size - mass.size;
      }

      // Friction
      mass.dx *= mass.friction;
      mass.dy *= mass.friction;

      // If mass is moving very slowly, stop moving it
      if (Math.abs(mass.dx) < mass.epsilon) mass.dx = 0;
      if (Math.abs(mass.dy) < mass.epsilon) mass.dy = 0;
    }

    // Send players, pellets and masses
    io.to(room.id).emit('update', {
      players: rooms.getAlivePlayers(room.id),
      masses: rooms.getMasses(room.id),
      eatenPellets,
      newPellets
    });
  });
}, 1000 / TICKRATE);

// Evaporation, will be sent to players on next tick
setInterval(() => {
  if (!up) return false;

  rooms.rooms.forEach(function(room) {
    // Get list of players
    var players = rooms.getAlivePlayers(room.id);

    // Evaporate for each player
    for (var player of players) {
      player.size = evaporate(player.size);
    }
  });
}, 1000 / EVAP_TICKRATE);

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
