// ----- Keyboard inputs -----
var keys = [];

document.addEventListener('keydown', function(e) {
    // Set keys value to true.
    if (!contains(keys, e.keyCode)) keys.push(e.keyCode);
});

document.body.addEventListener('keyup', function(e) {
    // Set keys value to false.
    index = keys.indexOf(e.keyCode);
    if (index > -1) keys.splice(index, 1);
});

// ----- Join button -----
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


// ----- Handle the input from the user -----
function handleInput() {
  dx = dy = 0;

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
}
