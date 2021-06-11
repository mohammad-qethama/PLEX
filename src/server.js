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
const peer = require('peer');
const morgan = require('morgan');
const multer = require('multer');
const multParse = multer();

const server = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(morgan('dev'));
app.use(multParse.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
//routes
app.use(router);
//catchalls
app.use('*', notFound);
app.use(internalError);


io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
    });
  });
});
module.exports={
  app:app,
  start:(port)=>{
    const PORT=port||4000;
    server.listen(PORT, ()=> console.log(`hello from port ${PORT}`));
  },
};
