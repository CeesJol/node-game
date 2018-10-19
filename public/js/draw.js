var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width = window.innerWidth,
    height = window.innerHeight;

// Initialization function that also is executed when you change the display size.
function main() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    width = canvas.width;
    height = canvas.height;
} main();

function update() {
    // Clear the current display.
    ctx.clearRect(0, 0, width, height);

    // Draw all players
    if (data) {
      for (var i = 0; i < data.length; i++) {
        ctx.rect(20,20,150,100);
        ctx.stroke();
      }
    }

    // Draw the pixels on the screen.
    window.requestAnimationFrame(update);
}

// Start the game.
window.onload = function() {
    update();
};
