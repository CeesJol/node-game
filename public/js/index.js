var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var socket = io();

// Connect to server
socket.on('connect', function() {
  console.log('Connected to server');
});

// Disconnect from server
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// LISTENER for data
socket.on('message', function(data) {
  console.log('Data: ' + data);
});

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

var keys = [];
var myPing = -2;

document.addEventListener('keydown', function(event) {
  keys[event.keyCode] = true;

  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

socket.emit('new player');

setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

setInterval(function() {
  socket.emit('requestPing', Date.now());
}, 1000);

var canvas = document.getElementById('myCanvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');



socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);

  var playerList = document.getElementById('player-list');

  // Empty player list
  playerList.innerHTML = "";

  // Draw all players
  for (var id in players) {
    var player = players[id];
    drawPlayer(player);

    // Show player in list
    var li = document.createElement('p');
    li.innerHTML = "<li>" + player.name + " (upload: " + player.ping + " ms)" + "</li>";
    playerList.appendChild(li);
  }

});

socket.on('pingResult', function(data) {
  // Draw ping
  myPing = Date.now() - data;

  document.getElementById('ping').innerHTML = "Ping: " + myPing + " ms";
})

function drawPlayer(player) {
  context.fillStyle = 'green';
  context.beginPath();
  context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
  context.fill();
}
