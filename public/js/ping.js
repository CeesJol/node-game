var ping = 0;

// Request ping every second
setInterval(function() {
  socket.emit('requestPing', Date.now());
}, 1000);

// Result from ping request
socket.on('resultPing', function(timestamp) {
  ping = Date.now() - timestamp;
});
