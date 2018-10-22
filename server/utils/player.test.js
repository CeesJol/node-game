const expect = require('expect');

const {Rooms} = require('./rooms');
const {Player} = require('./player');

// NOTE OUTDATED AF
describe('Player', () => {
  beforeEach(() => {
    rooms = new Rooms();

    rooms.rooms = [{
      id: 0,
      players: []
    }, {
      id: 1,
      players: [new Player(42, this.id)]
    }];
  });

  // WTF is this test lmao
  it('should return the room', () => {
    // Get the player from the room
    var player = rooms.rooms[1].players[0];

    // Get the roomId
    var roomId = player.roomId;

    expect(rooms.rooms[1].players[0].roomId).toEqual(roomId);
  });
});
