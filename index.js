'use strict';
const server = require('./src/server');
//Import the mongoose module
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const mongooseUri = process.env.MONGOOSE_URI;

mongoose
  .connect(mongooseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server(PORT);
  });
