'use strict';
const userModel = require('../models/Users.js');
module.exports = async (req, res, next) => {
  try {
    let token = req.cookies['token'] || req.cookies['session-token'];
    let user = await userModel.bearerAuth(token);
    req.user = user;
    console.log('inside islogged', token);
    token ? next() : res.redirect('/signin.html');
  } catch (error) {
    res.status(403).send('Acess Denied');
    // res.send ('Acess Denied')
  }
};
