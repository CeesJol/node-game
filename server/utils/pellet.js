const {getRandomColor, randomId} = require('./general');

class Pellet {
  constructor(roomId) {
    this.id = randomId();
    this.x = 0;
    this.y = 0;
    this.value = 1;
    this.room = {
      id: roomId
    }
    this.color = getRandomColor();
    this.size = 10; // radius of blob
  }
};

module.exports = {Pellet};
