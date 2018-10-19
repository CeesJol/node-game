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
  console.log('New message', room);
  data = room;
});

jQuery("#join").click(function() {
  var name = jQuery('#name').val();

  // Send join request to server
  socket.emit('join', { name }, function(err) {
    if (err) {
      console.log('Whoops...');
      alert(err);
    } else {
      console.log('Nice!');
      jQuery('#start').hide();
    }
  });
});
