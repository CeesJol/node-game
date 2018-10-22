const {Player} = require('./player');
const {Pellet} = require('./pellet');
const {randomId, rng} = require('./general');

const MAX_SIZE = 3;

class Rooms {

  // Set up Rooms list
  constructor() {
    this.rooms = [];
  }

  // Add a room
  addRoom(players) {
    var id = randomId();
    var size = 400;
    var players = players || [];
    var pellets = [];
    var room = {id, size, players, pellets};
    this.rooms.push(room);
    return room;
  }

  // Remove a room
  removeRoom(id) {
    // Select the room to be removed
    var room = this.rooms.filter((room) => room.id === id)[0];

    // If the room exists, remove it from the array
    if (room) {
      this.rooms = this.rooms.filter((room) => room.id !== id);
    }

    return room;
  }

  // Get a room
  getRoom(id) {
    // Select the room
    return this.rooms.filter((room) => room.id === id)[0];
  }

  // Get a list of players of a room
  getPlayers(id) {
    return this.getRoom(id).players;
  }

  // Get a list of players of a room that are alive
  getAlivePlayers(id) {
    return this.getRoom(id).players.filter((player) => player.alive === true);
  }

  // Add a player to a room
  addPlayer(roomId, player) {
    this.getRoom(roomId).players.push(player);

    return player;
  }

  // Add a pellet to a room
  spawnPellet(roomId) {
    var pellet = new Pellet(roomId);

    var roomSize = this.getRoom(roomId).size;

    pellet.x = rng(pellet.size, roomSize - pellet.size);
    pellet.y = rng(pellet.size, roomSize - pellet.size);

    this.getRoom(roomId).pellets.push(pellet);

    return pellet;
  }

  // Get a list of pellets in a room
  getPellets(roomId) {
    return this.getRoom(roomId).pellets;
  }

  // Player eats a pellet
  eatPellet(player, pellet) {
    // Increase player size
    player.size += pellet.value;

    // Remove pellet
    // Get pellets array
    var pellets = this.getPellets(player.room.id);

    // Remove it from the array
    pellets = pellets.filter((pel) => pel.id !== pellet.id);

    // Set pellets
    this.getRoom(player.room.id).pellets = pellets;
  }

  // Get a player from a room
  getPlayer(playerId) {
    // Find the player's room
    var room = this.rooms.filter((room) => {
      return room.players.filter((player) => player.id === playerId)[0];
    })[0];

    // Select the players
    var players = this.getPlayers(room.id);

    // Select the player from this room
    var cur = players.filter((user) => user.id === playerId)[0];

    return cur;
  }

  // Remove a player from a room
  removePlayer(playerId) {
    // Find the player's room
    var room = this.rooms.filter((room) => {
      return room.players.filter((player) => player.id === playerId)[0];
    })[0];

    // Select the players
    var players = this.getPlayers(room.id);

    // Select the player from this room
    var cur = players.filter((user) => user.id === playerId)[0];

    // If the player exists, remove it from the array
    if (cur) {
      room.players = room.players.filter((user) => user.id !== playerId);
    }

    // Return the removed player
    return cur;
  }

  // Find the best room for a user to join
  findBestRoom() {
    var bestRoom;

    for (var room of this.rooms) {
      if (room.players.length < MAX_SIZE) {
        bestRoom = room;
        break;
      }
    }

    if (bestRoom) {

      // We found a room, return it
      return bestRoom;
    } else {

      // All rooms are full, make a new room
      return this.rooms.addRoom();
    }
  }

  // Spawn the player somewhere in the room
  // TODO spawn player not close to other players
  spawnPlayer(player) {
    var roomSize = this.getRoom(player.room.id).size;

    player.x = rng(player.size, roomSize - player.size);
    player.y = rng(player.size, roomSize - player.size);

    return player;
  }
};

module.exports = {Rooms};
