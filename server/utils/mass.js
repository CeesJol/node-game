const {getRandomColor, randomId} = require('./general');

class Mass {
  constructor(roomId, x, y, dx, dy, color) {
    this.id = randomId();
    this.x = x;
    this.y = y;

    // Constants
    this.speedMultiplier = 10;
    this.friction = 0.95;
    this.epsilon = 0.00001;

    this.dx = dx * this.speedMultiplier;
    this.dy = dy * this.speedMultiplier;
    this.room = {
      id: roomId
    }
    this.color = color;
    this.size = 15; // radius of blob
  }
};

module.exports = {Mass};
