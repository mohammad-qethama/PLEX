'use strict';
// 'use strict';
// const Room = require('../models/Room');
// module.exports = async (req, res, next) => {
//   try {
//     const document = await Room.findOne({ roomId: req.params.id });
//     console.log('checkOwner:', document.owner);
//     if (document.owner === req.user.username) {
//       req.isOwner = true;
//       next();
//     } else {
//       req.isOwner = false;
//       next();
//     }
//   } catch (error) {
//     next(error);
//   }
// };
const Room = require ('../auth/models/Room.js');
const checkOwner = require ('../auth/middlewares/checkOwner.js');
const {expect}= require('@jest/globals');
const {app} = require ('../server.js');
const supergoose =require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const isLogged = require ('../auth/middlewares/isLogged.js')
const roomValidator = require ('../auth/middlewares/roomValidiator.js');
const jwt = require ('jsonwebtoken');
process.env.SECRET = 'toes';


describe ('checkOwner' , ()=>{

  const req= {};
  const res={
    status: jest.fn(()=>res),
    send: jest.fn(()=>res),
  };
  const next = jest.fn();

  it ('should success checkOuner' , async ()=>{
    let room = 'fc435680-e47c-4942-aadc-da1cb75edbc3'
    const document = {
        _id : '60c8996cbb90f50a7399fd6f',
        roomId : 'fc435680-e47c-4942-aadc-da1cb75edbc3',
        owner : 'tamara101',
        __v: 0
    }
    const user ={
        username:'tamara101',
    };
    req.user = {}
    req.user = user 
    document.owner = {}
    return await checkOwner(req, res, next)
      .then(() => {
        expect (req.isOwner).toBeTruthy

        expect (next).toHaveBeenCalled ();
      });
  });

  it ('should fail checkOuner' , async ()=>{
    let room = 'fc435680-e47c-4942-aadc-da1cb75edbc3'
    const document = {
        _id : '60c8996cbb90f50a7399fd6f',
        roomId : 'fc435680-e47c-4942-aadc-da1cb75edbc3',
        owner : 'tamara101',
        __v: 0
    }
    const user ={
        username:'neveen',
    };

    req.user = {}
    req.user = user 
    // document.owner = {}
    return await checkOwner(req, res, next)
      .then(() => {
          expect (req.isOwner).toBeFalsy()
        expect (next).toHaveBeenCalled ();
      });
  });

  it ('should success checkOuner from db' , async ()=>{
    let room = '802e32b1-e753-4dc0-b983-df175ad6f8f3';
    req.params  = {}

    req.params.id = room;
    const document = await Room.findOne({ roomId: room });
    console.log ('test document' , document)
    const user ={
        username:'neveen',
    };
    // req.user = {}
    req.user = user 
   
    return await checkOwner(req, res, next)
      .then(() => {
        expect (req.isOwner).toBeFalsy
        expect (next).toHaveBeenCalled ();
      });
  });


  it ('should get the room rout' , async ()=>{
    let room = 'a0ba2166-d6c7-47be-a18d-ddf7402e7582';
    req.params  = {}

    req.params.id = room;
    const user ={
        username:'tamara101',
    };
    req.user = user 
    let token = jwt.sign(user,process.env.SECRET);
    req.cookies = {}
    req.cookies['token']= token
    const response = await mockRequest
      .get(`/`)
      .set('params', `id ${room}`);
    
    expect(response.status).toBe(200);
   
  });

});
