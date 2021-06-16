'use strict';
const Room = require('../models/Room');
module.exports = async (req, res, next) => {
  try {
    //checking if the room id exsist in the db
    const document = await Room.findOne({ roomId: req.params.id });

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
