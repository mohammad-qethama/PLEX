'use strict';
const logger = require('../middlewares/logger.js');
describe('logger middleware', () => {
  let consoleSpy;
  const req = { method: 'get', path: 'test' };
  const res = {};
  const next = jest.fn();
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log');//.mockImplementation();
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  it('should log all get requests', () => {
    //act
    logger(req, res, next);
    //assert
    expect(consoleSpy).toHaveBeenCalledWith('REQUEST:', 'get', 'test');
    expect(next).toHaveBeenCalledWith();
  });
});