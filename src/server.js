'use strict';
//requiring modules
const router = require('./Router');
const notFound = require('./errors/404');
const internalError = require('./errors/500');

let broadcaster = {};
const roomsIds = {};
const roomsMassages = {};
const users = {};

// let usersConnected = [];
// requiring express to start the server
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const peer = require('peer');
const morgan = require('morgan');
const multer = require('multer');
const multParse = multer();

const eventRoutes = require('./routes/events.js');
const moment = require('moment'); //chat

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
app.use('/events', eventRoutes);

app.use(router);
//catchalls
app.use('*', notFound);
app.use(internalError);

// const {username}=require('./Router');//chat

io.on('connection', socket => {
  socket.on('join-room', payload => {
    console.log(payload.roomId);
    socket.join(payload.roomId);
    roomsIds[socket.id] = payload.roomId;

    io.to(payload).emit('hello', {
      roomId: payload.roomId,
      cookies: payload.cookies,
    });
    // socket.broadcast.to(roomId).emit('user-connected', userId);
  });
  //****************** */
  socket.on('new-user', payload => {
    socket.emit('old_massage', { message: roomsMassages[payload.roomId] });
    console.log('********************', roomsMassages[payload.roomId]);
    users[socket.id] = payload.name;
    socket.broadcast.to(payload.roomId).emit('user-connected', {
      name: payload.name,
      time: moment().format('h:mm a'),
    });
  });
  socket.on('send-chat-message', payload => {
    if (!roomsMassages[payload.roomId]) {
      roomsMassages[payload.roomId] = [];
    }

    roomsMassages[payload.roomId] = [
      ...roomsMassages[payload.roomId],
      {
        message: payload.message,
        name: users[socket.id],
        time: moment().format('h:mm a'),
      },
    ];

    socket.broadcast.to(payload.roomId).emit('chat-message', {
      message: payload.message,
      name: users[socket.id],
      time: moment().format('h:mm a'),
    });
  });

  //*************** */
  //chat
  socket.on('newUser', payload => {
    users[socket.id] = payload;
    // console.log('last check ya rab',payload);
    socket.broadcast.emit('chat-user-connected', {
      name: payload,
      time: moment().format('h:mm a'),
    });
  });
  //chat
  socket.on('message', payload => {
    // console.log('chat user connected',payload);
    socket.broadcast.emit('chat-message', payload);
  }); //chat
  
  // retrieve the broadcaster roomID saving it and  and emit it to the watcher.js on the same room listener `broadcaster`
  socket.on('broadcaster', roomId => {
    console.log(roomId);

    console.log('broadcstier ID');
    broadcaster[roomId.roomId] = socket.id;
    console.log('l54', broadcaster[roomId.roomId]);

    socket.broadcast.to(roomId.roomId).emit('broadcaster', roomId);
  });
  // sending watcher socket id to its room(socket.io room) broadcaster
  socket.on('watcher', roomId => {
    console.log('watcher ');

    socket.to(broadcaster[roomId]).emit('watcher', socket.id);
  });
  // sending the peer-to-peer offer from broadcaster to the watcher
  socket.on('offer', (id, message) => {
    console.log('offer ',message);
    socket.to(id).emit('offer', socket.id, message);
  });
  // sending the watcher answer of its own room broadcaster offer  to that broadcaster 
  socket.on('answer', (id, message) => {
    socket.to(id).emit('answer', socket.id, message);
  });
  // sending to watcher the SDP of its room broadcaster along with its socket.id
  socket.on('candidate', (id, message) => {
    console.log('candidate ');
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('disconnect', () => {
    if (socket.username) {
      socket
        .to(socket.username.roomId)
        .emit('remove-user', socket.username.username);
      socket.to(socket.username.roomId).emit('disconnectPeer', socket.id);
    }

    /******************* */
    const roomId = roomsIds[socket.id];

    socket.broadcast.to(roomId).emit('user-disconnected', {
      name: users[socket.id],
      time: moment().format('h:mm a'),
    });
    if (!io.sockets.adapter.rooms.get(roomId)) {
      delete roomsMassages[roomId];
    }
    delete users[socket.id];
    /*********************** */
  });
  socket.on('chat', () => {
    console.log('chat is delivered');
  });
  socket.on('remove-him', socketId => {
    // console.log(io.sockets.sockets.get(socketId));
    if (io.sockets.sockets.get(socketId)) {
      // console.log('IAM INNNNNNNNNNNNNNNNNNNNNN');
      socket.to(socketId).emit('kick-watcher');
      io.sockets.sockets.get(socketId).disconnect();
    }
  });
  socket.on('add-connected', payload => {
    console.log('we',payload);
    socket.username = {
      username: payload.username,
      roomId: payload.actualRoomId,
    };
    // console.log(socket.username);

    socket
      .to(payload.actualRoomId)
      .emit('users', { username: payload.username, soketId: socket.id });
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
