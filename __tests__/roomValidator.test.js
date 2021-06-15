'use strict';
const Room = require('../src/auth/models/Room.js');
const roomValidator = require('../src/auth/middlewares/roomValidiator.js');
const { expect } = require('@jest/globals');
const { app } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const jwt = require('jsonwebtoken');
process.env.SECRET = 'toes';

describe('room validator test', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  it('should fail to validate a room', async () => {
    req.params = {};
    req.params = {
      id: 'fc435680-e47c-4942-aadc-da1cb',
    };

    return await roomValidator(req, res, next).then(() => {
      expect(next).not.toHaveBeenCalled();
    });
  });
});
