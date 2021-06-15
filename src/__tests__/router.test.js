'use strict';

const {expect}= require('@jest/globals');
const {app} = require ('../server.js');
const supergoose =require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const router = require ('../Router.js');


describe ('404 error' , ()=>{
    it ('should return 404 error' , async ()=>{
        const response = await mockRequest
      .get('/test/test')
    expect(response.status).toBe(404);
    })
})