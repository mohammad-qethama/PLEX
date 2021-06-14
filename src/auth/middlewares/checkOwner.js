'use strict';
const Room = require('../models/Room');
module.exports = async (req, res, next) => {
  try {
    const document = await Room.findOne({ roomId: req.params.id });
    console.log('checkOwner:', document.owner);
    if (document.owner === req.user.username) {
      req.isOwner = true;
      next();
    } else {
      req.isOwner = false;
      next();
    }
  } catch (error) {
    next(error);
  }
};
