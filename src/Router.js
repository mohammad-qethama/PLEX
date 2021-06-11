'use strict';
const express = require('express');
const router = express.Router();
const UserModel=require('./auth/models/Users.js');
const basicAuth=require('./auth/middlewares/basic.js');
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


router.get('/', rootHandler);
function rootHandler(req, res) {
  res.send('root is working');
}

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

router.get ('/user' , bearer , (req,res)=>{

  const user={
    user:req.user,
  };

  res.status(200).json({user : user });
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


//facebook 
router.get('/facebooklogin', facebookOAuth, (req, res) => {

  res.json({ token: req.token, user: req.user });
});






module.exports = router;
