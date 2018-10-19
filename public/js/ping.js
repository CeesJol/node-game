// Request ping every second
setInterval(function() {
  socket.emit('requestPing', Date.now());
}, 1000);

// Result from ping request
socket.on('resultPing', function(timestamp) {
  jQuery('#ping').html(`Ping: ${Date.now() - timestamp} ms`);
});
