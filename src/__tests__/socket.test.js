'use strict';
const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const {expect} = require('@jest/globals');
// const User = require('../auth/models/Users');
describe('Socket', () => {
  let io, serverSocket, clientSocket;
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });
  afterAll(() => {
    io.close();
    clientSocket.close();
  });
  it('1 newUser', (done) => {
    clientSocket.on('new-user', (chat) => {
      expect(chat.roomId).toBe(room);
      expect(chat.name).toBe(firstName);
      done();
    });
    let firstName='tamara';
    let room='10';
    serverSocket.emit('new-user', {name:firstName,roomId:room});
  });
  it('2 send-chat-message', (done) => {
    clientSocket.on('send-chat-message', (chat) => {
      expect(chat.roomId).toBe('10');
      expect(chat.message).toBe(message);
      done();
    });
    let message='hello';
    let room='10';
    serverSocket.emit('send-chat-message', {message:message, roomId:room});
  });
  it('3 join-room', (done) => {
    clientSocket.on('join-room', (roomID) => {
      expect(roomID.roomId).toBe(room);
      done();
    });
    let room='10';
    serverSocket.emit('join-room', {roomId:room});
  });
  it('4 Testing broadcaster event', (done) => {
    clientSocket.on('broadcaster', (roomID) => {
      expect(roomID.roomId).toBe(room);
      done();
    });
    let room='10';
    serverSocket.emit('broadcaster', {roomId:room});
  });
});