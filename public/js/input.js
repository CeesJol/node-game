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

// ----- Mouse inputs -----
var mouse = {
  x: 0,
  y: 0
}
document.body.addEventListener('mousemove', function(e) {
    //e.preventDefault();

    // Store mouse input.
    mouse.x = e.clientX;
    mouse.y = e.clientY;
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

  if (player && player.alive) {
    // for (var key of keys) {
    //   if (key === keyInput.top) {
    //     dy = -player.speed;
    //   } else if (key === keyInput.left) {
    //     dx = -player.speed;
    //   } else if (key === keyInput.down) {
    //     dy = player.speed;
    //   } else if (key === keyInput.right) {
    //     dx = player.speed;
    //   }
    // }
    //
    // player.x += dx;
    // player.y += dy;

    var tempdx = 1 * (mouse.x - (width / 2));
    var tempdy = 1 * (mouse.y - (height / 2));

    dx = tempdx / (Math.abs(tempdx) + Math.abs(tempdy));
    dy = tempdy / (Math.abs(tempdx) + Math.abs(tempdy));

    if (Math.abs(tempdx) < 10 && Math.abs(tempdy) < 10) {
      dx = 0;
      dy = 0;
    }

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
