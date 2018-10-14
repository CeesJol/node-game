var player = function(name) {
  this.name = name;
  this.printName = function() {
    console.log("Hi, my name is " + name);
  }
}

module.exports = {player};
