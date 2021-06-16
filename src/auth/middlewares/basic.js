'use strict';
const base64 = require('base-64');
const UserModel = require('../models/Users.js');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send('Authorization header is not provided');
    return;
  }
  //splitting the header and remove 'Basic' from it
  let basic = req.headers.authorization.split(' ').pop();

  //decode the username and the password
  let [user, password] = base64.decode(basic).split(':');

  try {
    //checking and comparing if the username and the password exsist in the schema
    req.user = await UserModel.basicAuth(user, password);
    next();
  } catch (error) {
    res.status(403).send('Invalid Login');
  }
};
