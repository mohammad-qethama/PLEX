'use strict';

const mongoose = require('mongoose');

let RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  owner:{type: String, required: true},
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
