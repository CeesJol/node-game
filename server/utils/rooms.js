const {Player} = require('./player');

const MAX_SIZE = 3;

class Rooms {

  // Set up Rooms list
  constructor() {
    this.rooms = [];
  }

  // Generate random id
  randomId() {
    // return Date.now() + Math.floor(Math.random() * 1e6);

    var length = 10;
    var result = "Room_";

    var randomChar = () => {
      var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
      var val = Math.floor(Math.random() * chars.length);
      return chars.substr(val, 1);
    }

    for (var i = 0; i < length; i++) {
      result += randomChar();
    }

    return result;
  }

  // Add a room
  addRoom(players) {
    var id = this.randomId();
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

  // Get a list of players of a room that are alive
  getAlivePlayers(id) {
    return this.getRoom(id).players.filter((player) => player.alive === true);
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

  // Find the best room for a user to join
  // NOTE: this function is not working very well...
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


};

module.exports = {Rooms};
