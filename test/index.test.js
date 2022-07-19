import {exampleDecode} from "../src";

describe('example code test', function () {
  it('should decode', function () {
    expect(exampleDecode()).toEqual(new Uint8Array([
      18,  32,  41,  43, 236, 153,   0,  78,
      106,  28,   4, 162,  17, 113, 234,  81,
      131,  26,  21,  26, 180, 141,  80, 106,
      182, 104, 198,  66, 244, 226, 140, 110,
      182, 106
    ]));
  });
});
