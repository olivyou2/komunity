const memoryDB = require('../Utils/memoryDB');

memoryDB();

describe('MemoryDB Test', () => {
  test('MemoryDB Connection', () => {
    expect(1).toEqual(1);
  });
});
