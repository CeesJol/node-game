var socket = io();

// Store the player's info
var player;

// Store the players
var data = [];

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
  player = data;
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
socket.on('update', function(room) {
  // console.log('New message', room);
  data = room;

  // Store player
  if (player) {
    for (var entity of data) {
      if (entity.id == player.id) {
        player = entity;
      }
    }
  }
});
