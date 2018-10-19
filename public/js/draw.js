var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width = window.innerWidth,
    height = window.innerHeight;

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
    // canvas.height = window.innerHeight;
    canvas.height = 100;

    width = canvas.width;
    height = canvas.height;
} main();

function update() {
    // Clear the current display.
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    // ---- Hande input ----
    // Store possible movements
    var movement = {
      top: false,
      left: false,
      down: false,
      right: false
    };

    var dx = 0,
        dy = 0;

    // Check every pressed key
    for (var key of keys) {
      if (key === keyInput.top) {
        dy = -player.speed;
      } else if (key === keyInput.left) {
        dx = -player.speed;
      } else if (key === keyInput.down) {
        dy = player.speed;
      } else if (key === keyInput.right) {
        dx = player.speed;
      }
    }

    player.x += dx;
    player.y += dy;

    // Draw all players
    if (data) {
      for (var i = 0; i < data.length; i++) {
        drawPlayer(data[i].x, data[i].y, data[i].color, data[i].size);
      }
    }

    // Emit movement to server
    socket.emit('movement', { player, dx, dy });

    // Draw the pixels on the screen.
    window.requestAnimationFrame(update);
}

// Draw a player
function drawPlayer(x, y, color, size) {
  ctx.fillStyle = color;
  ctx.arc(x, y, size , 0, 2 * Math.PI);
  ctx.fill();
}

// Start the game.
window.onload = function() {
    update();
};

window.addEventListener('resize', function() {
    main();
});
