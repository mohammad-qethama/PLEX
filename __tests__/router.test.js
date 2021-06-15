'use strict';

const { expect } = require('@jest/globals');
const { app } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const router = require('../src/Router.js');

describe('404 error', () => {
  it('should return 404 error', async () => {
    const response = await mockRequest.get('/test/test');
    expect(response.status).toBe(404);
  });
});

describe('root test', () => {
  it('should get the root rout', async () => {
    // const mock = jest.fn();
    const response = await mockRequest.get('/');

    expect(response.status).toBe(200);
  });
});
