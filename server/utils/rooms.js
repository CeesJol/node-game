const {Player} = require('./player');

class Rooms {

  // Set up Rooms list
  constructor() {
    this.rooms = [];
  }

  // Add a room
  addRoom(id, players) {
    var players = players || [];
    var room = {id, players};
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

  // Add a player to a room
  addPlayer(roomId, player) {
    // console.log(this.getRoom(roomId));
    this.getRoom(roomId).players.push(player);

    return player;
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
};

module.exports = {Rooms};
