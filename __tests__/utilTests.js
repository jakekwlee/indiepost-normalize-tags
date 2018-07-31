const { uniqueFlatten, trimAndRemoveUnderscore } = require('../src/utils');

describe('Repository', () => {
  it('uniqueFlatten() should return array of tags properly', () => {
    const array = [1, 2, 3, 4, [5, 6], 1, 2, 3, [7], 8];
    expect(uniqueFlatten(array)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('trimAndRemoveUnderscore() should return array of tags properly', () => {
    const array = ' 스티브_부세미_ ';
    expect(trimAndRemoveUnderscore(array)).toEqual('스티브 부세미');
  });
});
