'use strict';

const Room = require('../models/Room');

// check if room exists
// assure creating rooms by the configured /createId path

module.exports = async (req, res, next) => {
  let id = req.params.id;
  console.log('id: middle:', id);
  await Room.find({ roomId: id }, (err, docs) => {
    docs.length
      ? next()
      : next(`fail to connect to room:${req.params.id} does not exist`);
  });
};
