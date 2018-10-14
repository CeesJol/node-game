var Player = function(x, y, name) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.ping = undefined;
  this.printName = function() {
    console.log("Hi, my name is " + name);
  }
}

module.exports = {Player};
