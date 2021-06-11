'use strict';
const express = require('express');
const router = express.Router();

const UserModel=require('./auth/models/Users.js');
const basicAuth=require('./auth/middlewares/basic.js');
const path = require('path');
const uuid = require('uuid').v4;
const Room = require('./auth/models/Room');

const roomValidator = require('./auth/middlewares/roomValidiator');



router.post('/signup',async (req,res,next)=>{
  try {
    let user= new UserModel(req.body);
    const userRecord= await user.save();
    const output={
      user:userRecord,
      token:userRecord.token,
    };
    res.status(201).json(output);
  } 
  catch (error) {
    next(error.message);
  }
});

router.post('/signin',basicAuth,(req,res,next)=>{
  const user={
    user:req.user,
    token:req.user.token,
  };
  res.status(200).json(user);
});



router.get('/', rootHandler);
router.post('/ctreatRoom', createRoom);
router.get('/:id', roomValidator, roomHandler);

function rootHandler(req, res) {
  res.send('root is working');
}
function roomHandler(req, res) {
  res.sendFile('room.html', { root: path.join(__dirname, '../public') });
}
async function createRoom(req, res) {
  let roomId = uuid();
  console.log(roomId);
  let room = new Room({ roomId: roomId });
  const record = await room.save();
  console.log('record.roomId:', record.roomId);
  res.redirect(`/${record.roomId}`);
}

module.exports = router;
