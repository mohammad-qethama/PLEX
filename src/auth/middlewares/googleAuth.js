'use strict';
require('dotenv').config();
const UserModel = require('../models/Users.js');
const { model } = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
module.exports= async (req,res,next)=>{
  let token = req.cookies['session-token'];
  let user = {};
  async function verify(){
    const ticket = await client.verifyIdToken({
      idToken:token ,
      audience : CLIENT_ID,
    });
    const payload = ticket.getPayload();
    user.name= payload.name;
    user.email= payload.email;
    user.picture=payload.picture;
    const username = payload.email;
    const password = '1111';
    let obj = {
      username : username,
      password : password,
    };
    try { // news 
      let user = new UserModel(obj); //news
      const userRecord = await user.save(); //news
    } catch (error) { // news
      res.redirect('/login'); // news
    }
  }
  verify().then(()=>{
    req.user=user;
    next();
  })
    .catch(error=>{
      res.redirect('/login');
    });
};