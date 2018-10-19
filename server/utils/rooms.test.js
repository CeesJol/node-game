const expect = require('expect');

const {Rooms} = require('./rooms');
const {Player} = require('./player');

describe('Rooms', () => {
  var rooms;
  var player;

  beforeEach(() => {
    rooms = new Rooms();

    rooms.rooms = [{
      id: 0,
      players: []
    }, {
      id: 1,
      players: [new Player(42, 1)]
    }];

    player = new Player(1, 2);
  });

  it('should add a room with players', () => {
    var rooms = new Rooms();
    var room = {
      players: [player]
    };
    var resRoom = rooms.addRoom(room.players);

    expect(rooms.rooms[0].players).toEqual(room.players);
  });
  it('should add a room without players', () => {
    var rooms = new Rooms();
    var room = {
      players: []
    };
    var resRoom = rooms.addRoom();

    expect(rooms.rooms[0].players).toEqual(room.players);
  });

  it('should remove a room', () => {
    var startLength = rooms.rooms.length;
    var resRoom = rooms.removeRoom(0);

    // Did the right room get removed?
    expect(resRoom.id).toEqual(0);

    // Is the room actually removed?
    expect(rooms.rooms.length).toEqual(startLength - 1);
  });
  it('should not remove room', () => {
    var startLength = rooms.rooms.length;
    var noRoom = rooms.removeRoom(90011009);

    // Is the room undefined?
    // Note: toBeFalsy is what toNotExist() was
    expect(noRoom).toBeFalsy();

    // Is no room removed?
    expect(rooms.rooms.length).toBe(startLength);
  });

  it('should find room', () => {
    var id = 1;

    var room = rooms.getRoom(id);

    expect(room).toEqual(rooms.rooms[id]);

    expect(room.id).toEqual(id);
  });

  it('should return list of players', () => {
    var id = 0;

    var players = rooms.getPlayers(id);

    expect(players).toEqual(rooms.rooms[id].players);
  });

  it ('should add the player', () => {
    var roomId = 0;
    var player = new Player(420, roomId);

    rooms.addPlayer(roomId, player);

    expect(rooms.rooms[roomId].players).toEqual([player]);
  });

  it('should get the player', () => {
    var roomId = 1;
    var startLength = rooms.rooms[roomId].players.length;

    var playerId = 42;
    var player = rooms.rooms[roomId].players[0];

    var resPlayer = rooms.removePlayer(playerId);

    // Did we select the right player?
    expect(resPlayer).toEqual(player);
  });

  it ('should remove the player', () => {
    var roomId = 1;
    var startLength = rooms.rooms[roomId].players.length;

    var playerId = 42;
    var player = rooms.rooms[roomId].players[0];

    var resPlayer = rooms.removePlayer(playerId);

    // Did the right player get removed?
    expect(resPlayer).toEqual(player);

    // Is the player actually removed?
    expect(rooms.rooms[1].players.length).toEqual(startLength - 1);
  });

  it('should find best room', () => {
    var bestRoom = rooms.findBestRoom();

    expect(bestRoom).toEqual(rooms.rooms[0]);
  })





});
