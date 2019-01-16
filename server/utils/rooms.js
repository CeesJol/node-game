const {Player} = require('./player');
const {Pellet} = require('./pellet');
const {Mass} = require('./mass');
const {randomId, rng, collision, pyth} = require('./general');

const MAX_PLAYER_SIZE = 10;          // Maximum amount of players in one room
const DEFAULT_ROOM_SIZE = 2000;      // Default size of the room (both width and height)
const CHUNK_SIZE = 200;             // Size of one chunk
const PELLETS_MULTIIPLIER = 0.02;   // Sets amount of pellets in the room

class Rooms {

  // Set up Rooms list
  constructor() {
    this.rooms = [];
  }

  // Add a room
  addRoom(players) {
    var id = randomId();
    var size = DEFAULT_ROOM_SIZE;
    var players = players || [];
    var masses = [];
    var pellets = [];
    var room = {id, size, players, masses, pellets};
    this.rooms.push(room);

    // Spawn some pellets
    for (var i = 0; i < DEFAULT_ROOM_SIZE * PELLETS_MULTIIPLIER; i++) {
      this.spawnPellet(id);
    }

    console.log('Created new room with id ' + room.id);

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
    var players = this.getRoom(roomId).players;

    // Keep spawning, until we find a good spot
    var done = false;
    while (!done) {
      pellet.x = rng(pellet.size, roomSize - pellet.size);
      pellet.y = rng(pellet.size, roomSize - pellet.size);

      // Check for collision with a player
      done = true;
      for (var player of players) {
        if(collision(player, pellet)) {
          done = false;
          break;
        }
      }
    }

    this.getRoom(roomId).pellets.push(pellet);

    return pellet;
  }

  // Add a mass to the room
  spawnMass(roomId, x, y, dx, dy, color) {
    var mass = new Mass(roomId, x, y, dx, dy, color);

    this.getRoom(roomId).masses.push(mass);

    return mass;
  }

  // Get a list of masses
  getMasses(id) {
    return this.getRoom(id).masses;
  }

  // Get a list of pellets in a room
  getPellets(roomId) {
    return this.getRoom(roomId).pellets;
  }

  // Player eats a pellet
  eatPellet(player, pellet) {
    // Increase player size
    player.size = pyth(player.size, pellet.size);

    // Remove pellet
    var pellets = this.getPellets(player.room.id);
    pellets = pellets.filter((pel) => pel.id !== pellet.id);
    this.getRoom(player.room.id).pellets = pellets;

    // Spawn new pellet
    return this.spawnPellet(player.room.id);
  }

  // Player eats a mass
  eatMass(player, mass) {
    // Increase player size
    player.size = pyth(player.size, mass.size);

    // Remove mass
    var masses = this.getMasses(player.room.id);
    masses = masses.filter((ma) => ma.id !== mass.id);
    this.getRoom(player.room.id).masses = masses;

    // Old way of removing mass
    // var index = masses.indexOf(mass);
    // if (index > -1) {
    //   masses.splice(index, 1);
    // }

    // Return this mass
    return mass;
  }

  // Get a player from a room
  getPlayer(playerId) {
    // Find the player's room
    var room = this.rooms.filter((room) => {
      return room.players.filter((player) => player.id === playerId)[0];
    })[0];

    if (!room) return undefined;

    // Select the players
    var players = this.getPlayers(room.id);

    // Select the player from this room
    var cur = players.filter((user) => user.id === playerId)[0];

    return cur;
  }

  // Remove a player from a room
  // TODO remove the room if empty?
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
      if (room.players.length < MAX_PLAYER_SIZE) {
        bestRoom = room;
        break;
      }
    }

    if (bestRoom) {

      // We found a room, return it
      return bestRoom;
    } else {

      // All rooms are full, make a new room
      return this.addRoom();
    }
  }

  // Spawn the player somewhere in the room
  // TODO spawn player not close to other players
  spawnPlayer(player) {
    var room = this.getRoom(player.room.id);
    var roomSize = room.size;
    var players = room.players;
    var pellets = room.pellets;

    // Keep spawning, until we find a good spot
    var done = false;
    while (!done) {
      player.x = rng(player.size, roomSize - player.size);
      player.y = rng(player.size, roomSize - player.size);

      // Check for collision with a player
      done = true;
      for (var ply of players) {
        if(ply.id !== player.id && collision(ply, player)) {
          done = false;
          break;
        }
      }

      // Check for collision with a pellet
      if (done) {
        for (var pellet of pellets) {
          if(collision(pellet, player)) {
            done = false;
            break;
          }
        }
      }
    }

    return player;
  }

  // Kill a player in the room
  kill(player) {
    player.alive = false;

    return player;
  }
};

module.exports = {Rooms};
