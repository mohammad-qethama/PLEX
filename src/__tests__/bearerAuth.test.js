'use strict';

const {expect}= require('@jest/globals');
require('@code-fellows/supergoose');
const bearer=require('../auth/middlewares/bearer');
const User = require('../auth/models/Users');
const jwt= require('jsonwebtoken');
process.env.SECRET='bearer';

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