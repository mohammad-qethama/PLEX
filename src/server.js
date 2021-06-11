'use strict';
//requiring modules
const router = require('./Router');
const notFound = require('./errors/404');
const internalError = require('./errors/500');


// requiring express to start the server
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const peer = require('peer');
const morgan = require('morgan');
const multer = require('multer');
const multParse = multer();

const cookieParser=require('cookie-parser');//new



app.use(cors());
app.use(morgan('dev'));
app.use(multParse.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.static('./public'));//new



app.use(cookieParser());//new

//routes
app.use(router);
//catchalls
app.use('*', notFound);
app.use(internalError);

module.exports = port => {
  app.listen(port, () => {
    console.log('Server is up . . . ');
    console.log(`Server is working at http://localhost:${port}`);
  });
};

// module.exports = {
//   server : app,
//   start : (port) => {
//     app.listen(port, () => {
//       console.log('Server is up . . . ');
//       console.log(`Server is working at http://localhost:${port}`);});
//   },
// };
