const expect = require('expect');

var {isRealString, pyth, pythNegative, collision} = require('./general');

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

  it('should return pyth of 13 minus 12', () => {
    var res = pythNegative(13, 12);

    expect(res).toEqual(5);
  })

  it('should collide', () => {
    var objA = {
      x: 0,
      y: 0,
      size: 10
    }

    var objB = {
      x: 5,
      y: 5,
      size: 10
    }

    expect(collision(objA, objB)).toBe(true);
  });

  it('should not collide', () => {
    var objA = {
      x: 30,
      y: 40,
      size: 10
    }

    var objB = {
      x: 5,
      y: 5,
      size: 10
    }

    expect(collision(objA, objB)).toBe(false);
  });
});
