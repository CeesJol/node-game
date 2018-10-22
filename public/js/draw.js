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

    // Reset player list
    var ol = jQuery('<ol></ol>');

    // Draw map border
    drawBorders();

    // Update all players
    if (data) {
      for (var entity of data.players) {
        if (player) {
          if (entity.id === player.id) {

            // Draw this player
            drawPlayer(width / 2, height / 2, player.color, player.size, player.name);
          } else {

            // Draw some other player
            drawPlayer(width / 2 - player.x + entity.x, height / 2 - player.y + entity.y, entity.color, entity.size, entity.name);
          }
        }

        // Add player to the list of players
        ol.append(jQuery('<li></li>').text(entity.name));
      }

      // Update all pellets
      if (player) {
        for (var pellet of data.pellets) {
          drawPellet(pellet);
        }
      }
    }

    // Draw list of players
    jQuery('#player-list').html(ol);

    // Send movement (if any) to server
    if (player && (dx !== 0 || dy !== 0)) {
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
  var roomSize = (player) ? player.room.size : 400;

  var x = (player && player.alive) ? player.x : roomSize / 2;
  var y = (player && player.alive) ? player.y : roomSize / 2;

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.rect(width / 2 - x, height / 2 - y, roomSize, roomSize);
  ctx.stroke();
  ctx.closePath();
}

// Start the game.
window.onload = function() {
    update();
};

window.addEventListener('resize', function() {
    main();
});
