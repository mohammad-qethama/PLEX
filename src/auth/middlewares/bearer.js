'use strict';
const userModel = require('../models/Users.js');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Not logged in user');
  } else {
    try {
      let token = req.headers.authorization.split(' ').pop();
      let user = await userModel.bearerAuth(token);
      if (user) {
        // console.log(user);
        req.user = user;
        next();
      } else {
        next('Access Denied');
      }
    } catch (error) {
      res.status(403).send('Access Denied');
    }
  }
};
