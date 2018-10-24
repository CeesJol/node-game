var socket = io();

// Standard room size
var roomSize = 400;

// Store the player's info
var player = {
  alive: false,
  id: undefined,
  name: "player",
  room: {
    id: undefined,
    size: roomSize
  },
  x: roomSize / 2,
  y: roomSize / 2
};

// Store the players, and pellets
var players = [],
    pellets = [];

// Store maxlength. default 10
var MAX_USERNAME_LENGTH = 10;

socket.on('connect', function() {
  console.log('Connected to server');

  // Since we have successfully connected, show the join form
  jQuery('#start').show();
  jQuery('#error').hide();
});

// Receive player info
socket.on('playerInfo', function(data) {
  player = data.me;
  pellets = data.room.pellets;
  console.log('Joined room ' + data.room.id);
});

// Receive general info
socket.on('info', function(data) {
  MAX_USERNAME_LENGTH = data.MAX_USERNAME_LENGTH;
  jQuery('#name').attr('maxlength', MAX_USERNAME_LENGTH);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');

  // Since we are no longer in a room, show the join form
  jQuery('#start').hide();
  jQuery('#error').show();
});

// Listen to updates from the server
socket.on('update', function(data) {
  players = data.players;

  // Store player
  if (player) {
    for (var entity of data.players) {
      if (entity.id == player.id) {
        player = entity;
      }
    }
  }



  // Remove eaten pellets
  for (var pellet of data.eatenPellets) {
    pellets = pellets.filter(function(pel) {
      return pellet.id != pel.id
    });
  }

  // Add new pellets
  for (var pellet of data.newPellets) {
    pellets.push(pellet);
  }
});

// Did you dieded to deaf?
socket.on('died', function() {
  // Since we are dead, show join form
  jQuery('#start').show();

  // Change text to death message
  jQuery('#message').html('WELP U DIEDED LAWL');

  // Reset player
  player.alive = false;
  player.x = player.room.size / 2;
  player.y = player.room.size / 2;
});
