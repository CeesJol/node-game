class Player {
  constructor(id, roomId) {
    this.x = 0;
    this.y = 0;
    this.id = id;
    this.roomId = roomId;
    this.alive = false;
    this.name = undefined;
    this.color = this.getRandomColor();
    this.size = 50;
    this.speed = 1;
  }

  getRandomColor() {
    var randomValue = () => Math.floor(Math.random() * 256);


    return 'rgb(' + randomValue() + ', ' + randomValue() + ', ' + randomValue() + ')';
  }

  spawn() {
    // ...
  }
};

module.exports = {Player};
