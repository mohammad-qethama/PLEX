'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  owner: { type: String, required: true },
  category: { type: String, default: 'public', enum: ['private', 'public'] },
  password: { type: String },
});
RoomSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
RoomSchema.statics.basicAuth = async function (roomId, password) {
  //TODO
  const room = await this.findOne({ roomId });

  const valid = await bcrypt.compare(password, room.password);

  // console.log('valid', valid);
  if (valid) {
    return room;
  }
  throw new Error('Invalid room or room password');
};

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
