'use strict';
const { expect } = require('@jest/globals');
const isLogged = require('../src/auth/middlewares/isLogged.js');
const User = require('../src/auth/models/Users.js');
const router = require('../src/Router.js');
const { app } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const bearer = require('../src/auth/middlewares/bearer.js');
process.env.SECRET = 'toes';
const jwt = require('jsonwebtoken');
const userModel = require('../src/auth/models/Users.js');
describe('isLogged', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();
  it('should fail isLogged validator', () => {
    const user = { username: 'admin' };

    return isLogged(req, res, next).then(() => {
      req.user = user;

      expect(res.send).toBeCalledWith('Acess Denied');
    });
  });

  it('should success isLogged validator', async () => {
    let user = {
      username: 'admin',
    };
    let token = jwt.sign(user, process.env.SECRET);
    req.cookies = {};
    req.cookies['token'] = token;
    req.user = user;
    return await isLogged(req, res, next).then(() => {
      expect(next).toHaveBeenCalled();
    });
  });
});
