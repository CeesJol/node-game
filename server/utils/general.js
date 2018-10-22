var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

var rng = (start, stop) => {
  return Math.random() * (stop - start) + start;
}

var getRandomColor = () => {
  var randomValue = () => Math.floor(Math.random() * 256);

  return 'rgb(' + randomValue() + ', ' + randomValue() + ', ' + randomValue() + ')';
}

var pyth = (a, b) => {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}


  // Generate random id
var randomId = () => {
  // return Date.now() + Math.floor(Math.random() * 1e6);

  var length = 10;
  var result = "";

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

module.exports = {isRealString, rng, getRandomColor, pyth, randomId};
