'use strict';
const express = require('express');
const router = express.Router();

const UserModel = require('./auth/models/Users.js');
const basicAuth = require('./auth/middlewares/basic.js');

const bearer = require('./auth/middlewares/bearer.js');
require('dotenv').config();//new

const path=require('path');//new

const googleAuth= require('../src/auth/middlewares/googleAuth');//new

const facebookOAuth=require('../src/auth/middlewares/facebookAuth');//new facebook

//googleOauth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID =process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
//new

const DataCollection=require('../src/auth/models/dataCollection');//api

const EventSchema=require('../src/auth/models/Events');//api

const fs=require('fs');//api
const models=new Map();//api



const uuid = require('uuid').v4;
const Room = require('./auth/models/Room');

const roomValidator = require('./auth/middlewares/roomValidiator');

const { model } = require('mongoose');






router.post('/signup', async (req, res, next) => {

  try {
    let user = new UserModel(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.redirect('/signin.html');
  } catch (error) {
    next(error.message);
  }
});

router.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.end();
});

router.get('/user', bearer, (req, res) => {
  const user = {
    user: req.user,
  };

  res.status(200).json({ user: user });
});

router.get('/protected',googleAuth,(req,res)=>{//googleAuth
  res.send('this is protected route');
});//new 

router.get('/login',(req,res)=>{
  res.sendFile('auth.html', { root: path.join(__dirname, '../public') });
});//new

router.post('/login',(req,res)=>{
  let token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
  }
  verify()
    .then(() => {
      res.cookie('session-token', token);
      res.redirect('/profile');

    })
    .catch(console.error);
});//new


router.get('/profile',googleAuth,(req,res)=>{
  let user=req.user;
  res.send(user);
});//new

router.get('/googlelogout',(req,res)=>{
  res.clearCookie('session-token');
  res.redirect('/login');
});//new


// facebook 
// router.get('/facebooklogin', facebookOAuth, (req, res) => {

//   res.json({ token: req.token, user: req.user });
// });



//api
router.post('/createEvent',creatEventHandler);
router.get('/getEvents',getAllEventHandler);
router.get('/getEvents/:id',getEventHandler);

const dataManager=new DataCollection(EventSchema);

async function creatEventHandler(req,res){
  try{
    let obj= req.body;
    let record=await dataManager.create(obj);
    res.status(201).json(record);
  }catch(e){
    return console.log(e) ;
  }
}

async function getAllEventHandler (req,res){
  let allRecords= await dataManager.get();
  res.status(200).json(allRecords);
}

async function getEventHandler(req,res){
  const id = req.params.id;
  let record = await dataManager.get(id);
  res.status(200).json(record);
}

// /api


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
