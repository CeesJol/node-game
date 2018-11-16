const {randomId} = require('./general');

const MASS_SIZE = 15;

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
    this.size = MASS_SIZE; // radius of blob
  }

  static get MASS_SIZE() {
    return MASS_SIZE;
  }
};

module.exports = {Mass};
