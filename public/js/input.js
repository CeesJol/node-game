// ----- Keyboard inputs -----
var keys = [];

document.addEventListener('keydown', function(e) {
  if (player && player.alive) {
    // Send mass
    if (e.keyCode == keyInput.w && !keys[keyInput.w]) {
      console.log('w');

      keys[keyInput.w] = true;

      // Send request to send mass
      // note, this is a (send mass) request, not a send (mass request) :)
      // u know them code gewd when u see these comments amritie
      socket.emit('sendMassRequest');
    }

    // Split
    if (e.keyCode == keyInput.space && !keys[keyInput.space]) {
      console.log('split');

      keys[keyInput.space] = true;

      // Send request to split
      socket.emit('splitRequest');
    }
  }
});

document.body.addEventListener('keyup', function(e) {
  // Set key value to false
  keys[e.keyCode] = false;
});

// ----- Mouse inputs -----
var mouse = {
  x: 0,
  y: 0
}

document.body.addEventListener('mousemove', function(e) {
  // Store mouse input.
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function handleMouseInput() {
  dx = dy = 0;

  if (player && player.alive) {
    // Get dx and dy
    var tempdx = mouse.x - (width / 2);
    var tempdy = mouse.y - (height / 2);

    // Normalize the speed
    dx = tempdx / (Math.abs(tempdx) + Math.abs(tempdy));
    dy = tempdy / (Math.abs(tempdx) + Math.abs(tempdy));

    // Mouse is at the middle of the blob, so don't move
    if (Math.abs(tempdx) < 10 && Math.abs(tempdy) < 10) {
      dx = 0;
      dy = 0;
    }

    // Add delta values to player coordinates
    player.x += dx;
    player.y += dy;

    // Within border check (also happens on server)
    if (player.x < player.size) {
      player.x = player.size;
    } else if (player.x > player.room.size - player.size) {
      player.x = player.room.size - player.size;
    }

    if (player.y < player.size) {
      player.y = player.size;
    } else if (player.y > player.room.size - player.size) {
      player.y = player.room.size - player.size;
    }
  }
}

// ----- Join button -----
jQuery("#join").click(function() {
  var name = jQuery('#name').val();

  // Send join request to server
  socket.emit('join', { name }, function(err) {
    if (err) {
      // Error callback
      alert(err);
    } else {
      // Success callback
      jQuery('#start').hide();
    }
  });
});
