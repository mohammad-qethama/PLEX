'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let UsersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'editor', 'admin'],
    },
  },
  { timestamps: true }
);

UsersSchema.pre('save', function () {
  //TODO
});

UsersSchema.virtual('token').get(function () {
  //TODO
});
UsersSchema.virtual('cabailites').get(function () {
  //TODO
});

//Static method for sign in and authntication
UsersSchema.statics.basicAuth = function (username, password) {
  //TODO
};
//Static method for bearer token
UsersSchema.statics.bearerAuth = function (token) {
  //TODO
};

const UserModel = mongoose.model('User', UsersSchema);
module.exports = UserModel;
