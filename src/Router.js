'use strict';
const express = require('express');
const router = express.Router();
const UserModel=require('./auth/models/Users.js');
const basicAuth=require('./auth/middlewares/basic.js');
const bearer = require('./auth/middlewares/bearer.js');

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
  res.status(200).json({user : req.user.username});
});









module.exports = router;
