var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width = window.innerWidth,
    height = window.innerHeight;

var fontSize = 20;

var dx = 0,
    dy = 0;

// input variables
// TODO make a settings file
var keyInput = {
  top: 87,
  left: 65,
  down: 83,
  right: 68
}

var sortedPlayers;

// Initialization function that also is executed when you change the display size.
function main() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    width = canvas.width;
    height = canvas.height;

    ctx.font = fontSize + 'px Arial';
} main();

// TODO ffs all these if(player)s are annoying
function update() {
    // Clear the current display.
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    // Handle local input
    handleInput();

    // Draw map border
    drawBorders();

    // Update all players
    for (var entity of players) {
      if (entity.id === player.id) {

        // Draw this player
        drawPlayer(width / 2, height / 2, player.color, player.size, player.name);
      } else {

        // Draw some other player
        drawPlayer(width / 2 - player.x + entity.x, height / 2 - player.y + entity.y, entity.color, entity.size, entity.name);
      }
    }

    // Update all pellets
    for (var pellet of pellets) {
      drawPellet(pellet);
    }

    // Draw list of players
    drawPlayerNames();

    // Draw score
    drawScore();

    // Draw ping
    drawPing();

    // Send movement (if any) to server
    if (player.alive && (dx !== 0 || dy !== 0)) {
      socket.emit('movement', { dx, dy });
    }

    // Draw the pixels on the screen.
    window.requestAnimationFrame(update);
}

// Draw a player
function drawPlayer(x, y, color, size, name) {
  // Draw blob
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // Draw user name
  ctx.beginPath();
  ctx.fillStyle = 'white';
  var width = ctx.measureText(name).width;
  ctx.textBaseLine = 'middle';
  ctx.fillText(name, x - width / 2, y + fontSize / 4);
  ctx.closePath();
}

// Draw a pellet
function drawPellet(pellet) {
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.arc(width / 2 - player.x + pellet.x, height / 2 - player.y + pellet.y, pellet.size, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

// Draw map borders
function drawBorders() {
  // Get room size (default: 400)
  var roomSize = player.room.size;

  var x = (player.alive) ? player.x : roomSize / 2;
  var y = (player.alive) ? player.y : roomSize / 2;

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.rect(width / 2 - x, height / 2 - y, roomSize, roomSize);
  ctx.stroke();
  ctx.closePath();
}

// Draw score
function drawScore() {
  if (player.alive) {
    ctx.fillStyle = 'black';
    ctx.fillText("score: " + Math.floor(player.size), 10, 10 + fontSize);
  }
}

// Draw list of players
function drawPlayerNames() {
  sortedPlayers = insertionSort(players)

  var marginRight = 120;
  ctx.fillStyle = 'black';
  ctx.fillText("Leaderboard", width - marginRight, 10 + fontSize);
  for (var i = 0; i < Math.min(10, sortedPlayers.length); i++) {
    var entity = sortedPlayers[i];

    ctx.fillText((i + 1) + ". " + entity.name, width - marginRight, 10 + fontSize * (i + 2));
  }
}

// Draw ping
function drawPing() {
  ctx.fillStyle = 'black';
  ctx.fillText("ping: " + ping + " ms", 10, height - 10);
}

// Start the game.
window.onload = function() {
    update();
};

window.addEventListener('resize', function() {
    main();
});
