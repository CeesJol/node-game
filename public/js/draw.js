var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width = window.innerWidth,
    height = window.innerHeight;

var fontSize = 20;

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

    ctx.font = fontSize + 'px Arial';
} main();

function update() {
    // Clear the current display.
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    // ---- Hande input ----
    var dx = 0,
        dy = 0;

    // Check every pressed key
    if (player) {
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
    }

    // Draw all players
    if (data) {
      for (var i = 0; i < data.length; i++) {
        drawPlayer(data[i].x, data[i].y, data[i].color, data[i].size, data[i].name);
      }
    }

    if (player) {
      // Emit movement to server
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
  ctx.arc(x, y, size , 0, 2 * Math.PI);
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

// Start the game.
window.onload = function() {
    update();
};

window.addEventListener('resize', function() {
    main();
});
