class Player {
  constructor(id, roomId) {
    this.x = 0;
    this.y = 0;
    this.id = id;
    this.roomId = roomId;
    this.alive = false;
  }

  spawn() {
    // ...
  }
};

module.exports = {Player};
