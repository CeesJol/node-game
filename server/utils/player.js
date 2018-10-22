const {rng, getRandomColor} = require('./general');

class Player {
  constructor(id, roomId, roomSize) {
    this.x = 0;
    this.y = 0;
    this.id = id;
    this.room = {
      id: roomId,
      size: roomSize
    }
    this.alive = false;
    this.name = "player";
    this.color = getRandomColor();
    this.size = 50;
    this.speed = 1;
  }

  // TODO spawn player not close to other players
  spawn(roomSize) {
    this.x = rng(this.size, roomSize - this.size);
    this.y = rng(this.size, roomSize - this.size);
  }
};

module.exports = {Player};
