var socket = io();

// Store the player's info
var player;

// Store the players
var data;

socket.on('connect', function() {
  console.log('Connected to server');
});

// Receive player player info
socket.on('playerInfo', function(data) {
  player = data;
  console.log('Joined room ' + data.roomId);
})

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// Listen to updates from the server
socket.on('update', function(room) {
  // console.log('New message', room);
  data = room;
});
