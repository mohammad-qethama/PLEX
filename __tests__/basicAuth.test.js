'use strict';
require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const { app } = require('../src/server');
const basic = require('../src/auth/middlewares/basic');
const request = supergoose(app);
var faker = require('faker');
//arrange
let users;
let randomName = faker.name.findName();
beforeAll(() => {
  users = {
    // username: 'Tamara',
    username: randomName,
    password: '12345',
    role: 'user',
  };
});

describe('Basic Auth testing', () => {
  it('Can successfully POST to /signup to create a new user', async () => {
    const response = await request.post('/signup').send(users);
    expect(response.status).toBe(302);
    // console.log(response.headers.location);
    // expect(response.headers.location).toEqual('/signin.html');
    // expect(response.body.user.username).toBe(users.username);
  });
  it('Can successfully POST to /signin to login as a user (use basic auth)', async () => {
    const response = await request
      .post('/signin')
      .auth(users.username, users.password);
    expect(response.status).toBe(200);
    expect(response.body.user.username).toEqual(users.username);
    expect(response.body.user.password.length).toBeGreaterThan(0);
  });
  it('Should return 403 status when the username  is not correct', async () => {
    let credentials = {
      username: 'Neveen',
      password: '123',
    };
    const response = await request
      .post('/signin')
      .auth(credentials.username, credentials.password);
    expect(response.status).toBe(403);
  });
  it('Should return 403 status when password is missing', async () => {
    let credentials = {
      username: 'Tamara',
    };
    const response = await request
      .post('/signin')
      .auth(credentials.username, credentials.password);
    expect(response.status).toBe(403);
  });
  it('Should return 401 status without authorization headers', async () => {
    let credentials = {
      username: 'Tamara',
    };
    const response = await request.post('/signin').send(credentials);
    expect(response.status).toBe(401);
  });
});
describe('Basic Auth Middleware', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();
  describe('user authentication', () => {
    it('fails a login for a user  with incorrect basic credentials', () => {
      // Change the request to match this test case
      req.headers = {
        authorization: 'Basic YWRtaW46Zm9v',
      };
      return basic(req, res, next).then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });
  });
});
