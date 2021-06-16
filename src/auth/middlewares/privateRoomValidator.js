'use strict';

const Room = require('../models/Room');
let base64 = require('base-64');

// check if private room exists
// assure creating rooms by the configured /createId path

module.exports = async (req, res, next) => {
  try {
    let id = req.params.id;
    console.log(req.params);
    let decoded = base64.decode(req.query.p);
    let password = decoded;
    let document = await Room.basicAuth(id, password);
    if (document) {
      next();
    } else {
      next('privte room does not exist');
    }
  } catch (error) {
    console.log(error);
  }
};
