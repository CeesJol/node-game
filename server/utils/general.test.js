const expect = require('expect');

var {isRealString, pyth} = require('./general');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var string = 5.5;
    var res = isRealString(string);

    expect(res).toBe(false);
  });
  it('should reject string with only spaces', () => {
    var string = "    ";
    var res = isRealString(string);

    expect(res).toBe(false);
  });
  it('should allow strings with non-space characters', () => {
    var string = "this is a string";
    var res = isRealString(string);

    expect(res).toBe(true);
  });

  it('should return pyth of 3 and 4', () => {
    var res = pyth(3, 4);

    expect(res).toEqual(5);
  });
});
