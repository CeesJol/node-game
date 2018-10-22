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

module.exports = {isRealString, rng, getRandomColor};
