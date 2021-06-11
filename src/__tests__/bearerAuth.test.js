'use strict';

const {expect}= require('@jest/globals');

const bearer=require('../auth/middlewares/bearer');
const User = require('../auth/models/Users');
const jwt= require('jsonwebtoken');
process.env.SECRET='bearer';
const router = require ('../Router.js');
const {app} = require ('../server.js');
const supergoose =require('@code-fellows/supergoose');
const mockRequest = supergoose(app);

let users={
  admin: {
    username: 'admin',
    password:'123',
  },
}; 

beforeAll(async ()=>{
  await new User(users.admin).save();
});


describe('bearer test',()=>{

  const req= {};
  const res={
    status: jest.fn(()=>{
      return res;
    }),
    send: jest.fn(()=>{
      return res;
    }),
  };

  const next = jest.fn();

  describe('user Auth',()=>{
    it('should fail the login for the user admin with an incorrect token',()=>{
      req.headers={
        authorization : 'Bearer wrongToken',
      };
      return bearer (req,res,next).then (()=>{
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);  
      });
    });

    it('should login the user admin with an correct token',async()=>{
      const user ={
        username:'admin',
      };
      const token = jwt.sign(user,process.env.SECRET);
      req.headers={
        authorization:`Bearer ${token}`,
      };
      return bearer(req,res,next).then(()=>{
        expect(next).toHaveBeenCalledWith();
      });
    });

  });

});




describe ('user rout with bearer',()=>{

  const req= {};
  const res={
    status: jest.fn(()=>{
      return res;
    }),
    send: jest.fn(()=>{
      return res;
    }),
  };

  it ('should fail to return the user' , async ()=>{
    const bearerResponse = await mockRequest
      .get('/user')
      .set('Authorization', `Bearer foobar`);
    expect(bearerResponse.status).toBe(403);
  });
  it ('should return the user' , async ()=>{
    const user ={
      username:'admin',
    };
    const token = jwt.sign(user,process.env.SECRET);
    req.headers={
      authorization:`Bearer ${token}`,
    };
    const bearerResponse = await mockRequest
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(bearerResponse.status).toBe(200);
  });
});
