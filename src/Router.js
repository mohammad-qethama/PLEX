'use strict';
const express = require('express');
const router = express.Router();
const UserModel = require('./auth/models/Users.js');
const basicAuth = require('./auth/middlewares/basic.js');
const isLogged = require('./auth/middlewares/isLogged');
const bearer = require('./auth/middlewares/bearer.js');
const checkOwner = require('./auth/middlewares/checkOwner');
require('dotenv').config(); //new
const path = require('path'); //new
const googleAuth = require('../src/auth/middlewares/googleAuth'); //new
const facebookOAuth = require('../src/auth/middlewares/facebookAuth'); //new facebook
//googleOauth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
//new
const DataCollection = require('../src/auth/models/dataCollection'); //api
const EventSchema = require('../src/auth/models/Events'); //api
const fs = require('fs'); //api
const models = new Map(); //api
const uuid = require('uuid').v4;
const Room = require('./auth/models/Room');
const roomValidator = require('./auth/middlewares/roomValidiator');
const { model } = require('mongoose');


router.use(express.static(path.join(__dirname, '../public/broadcast')));


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
  const userObject = {
    user: req.user,
    token: req.user.token,
  };
  res.json(userObject);
});
router.get('/user', isLogged, (req, res) => {
  const user = {
    user: 'fixed',
  };
  res.status(200).json({ user: user });
});
router.get('/protected', googleAuth, (req, res) => {
  //googleAuth
  res.send('this is protected route');
});

router.get('/login', (req, res) => {
  res.sendFile('auth.html', { root: path.join(__dirname, '../public') });
});

router.post('/login', (req, res) => {
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
      res.cookie('session-token', token).redirect('/profile');
    })
    .catch(console.error);
});
router.get('/profile', googleAuth, (req, res) => {
  let user = req.user;
  // console.log(req.cookies['token']);
  res.end(); // new
  // res.send(user);
});
router.get('/logout', (req, res) => {
  res.clearCookie('session-token'); // new
  res.clearCookie('token'); // new
  res.sendFile('signin.html', { root: path.join(__dirname, '../public') });
});
// facebook
router.get('/facebooklogin', facebookOAuth, (req, res) => {
  res.cookie('session-token', req.token).redirect();
  // res.cookie('session-token',req.token).json({ token: req.token, user: req.user });
  // res.json({ token: req.token, user: req.user });
});
//api
router.post('/createEvent', creatEventHandler);
router.get('/getEvents', getAllEventHandler);
router.get('/getEvents/:id', getEventHandler);
const dataManager = new DataCollection(EventSchema);
async function creatEventHandler(req, res) {
  try {
    let obj = req.body;
    let record = await dataManager.create(obj);
    res.status(201).json(record);
  } catch (e) {
    return console.log(e);
  }
}
async function getAllEventHandler(req, res) {
  let allRecords = await dataManager.get();
  res.status(200).json(allRecords);
}
async function getEventHandler(req, res) {
  const id = req.params.id;
  let record = await dataManager.get(id);
  res.status(200).json(record);
}
// /api
router.get('/', rootHandler);

router.post('/ctreatRoom', isLogged, createRoom);
router.get('/:id', isLogged, roomValidator, checkOwner, roomHandler);

function rootHandler(req, res) {
  res.send('root is working');
}
function roomHandler(req, res) {
  // res.sendFile('broadcaster.html', {
  //   root: path.join(__dirname, '../public/broadcast'),
  // });
  // res.render('broadcaster.html');
  req.isOwner
    ? res.sendFile('broadcaster.html', {
        root: path.join(__dirname, '../public/broadcast'),
      })
    : res.sendFile('watcher.html', {
        root: path.join(__dirname, '../public/broadcast'),
      });
}
async function createRoom(req, res) {
  let roomId = uuid();
  console.log(roomId);
  let room = new Room({ roomId: roomId, owner: req.user.username });
  const record = await room.save();
  console.log('record.roomId:', record.roomId, record.owner);
  res.redirect(`/${record.roomId}`);
}
module.exports = router;