const {getRandomColor} = require('./general');

class Player {
  constructor(id, roomId, roomSize) {
    this.x = roomSize / 2;
    this.y = roomSize / 2;
    this.dx = 0;
    this.dy = 0;
    this.id = id;
    this.room = {
      id: roomId,
      size: roomSize
    }
    this.alive = false;
    this.name = "player";
    this.color = getRandomColor();
    this.size = 50; // radius of blob
    this.speed = 2;
  }
};

module.exports = {Player};
