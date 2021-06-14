'use strict';
//requiring modules
const router = require('./Router');
const notFound = require('./errors/404');
const internalError = require('./errors/500');

let broadcaster = {};


// requiring express to start the server
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const peer = require('peer');
const morgan = require('morgan');
const multer = require('multer');
const multParse = multer();


const cookieParser = require('cookie-parser'); //new


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


app.use(express.static('./public')); //new

app.use(cookieParser()); //new

app.use(express.static(path.join(__dirname, '../public')));

//routes
app.use(router);
//catchalls
app.use('*', notFound);
app.use(internalError);
io.on('connection', socket => {
  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
  });
  socket.on('broadcaster', roomId => {
    console.log(roomId);
    console.log('broadcstier ID');
    broadcaster[roomId.roomId] = socket.id;
    console.log('l54', broadcaster[roomId.roomId]);

    socket.broadcast.to(roomId.roomId).emit('broadcaster', roomId);
  });
  socket.on('watcher', roomId => {
    console.log('watcher ');
    socket.to(broadcaster[roomId]).emit('watcher', socket.id);
  });
  socket.on('offer', (id, message) => {
    console.log('offer ');
    socket.to(id).emit('offer', socket.id, message);
  });
  socket.on('answer', (id, message) => {
    console.log('answer ');
    socket.to(id).emit('answer', socket.id, message);
  });
  socket.on('candidate', (id, message) => {
    console.log('candidate ');
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('disconnect', (roomId, userId) => {
    socket.broadcast.to(roomId).emit('user-disconnected', userId);
  });
  socket.on('chat', () => {
    console.log('chat is delivered');
  });
});
module.exports = {
  app: app,
  start: port => {
    const PORT = port || 4000;
    server.listen(PORT, () => {
      console.log('Server is up . . . ');
      console.log(`Server is working at http://localhost:${port}`);
    });
  },
};
// module.exports = {
//   server : app,
//   start : (port) => {
//     app.listen(port, () => {
//       console.log('Server is up . . . ');
//       console.log(`Server is working at http://localhost:${port}`);});
//   },
// };
