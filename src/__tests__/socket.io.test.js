'use strict';
// const { createServer } = require('http');
const socket  = require('socket.io');
const Client = require('socket.io-client');
const {app}  = require('../server.js');
const server = require('http').createServer(app);
require('dotenv').config();
const io = socket(server, {
  cors: { origin: '*' },
});



// console.log('io', io);

describe('my awesome project', () => {
//   let io, serverSocket, clientSocket;

  //   beforeAll((done) => {
  //     const httpServer = createServer();
  //     io = new Server(httpServer);
  //     console.log('io', io);
  //     httpServer.listen(() => {
  //       const port = httpServer.address().port;
  //       clientSocket = new Client(`http://localhost:${port}`);
  //       io.on('connection', (socket) => {
  //         serverSocket = socket;
  //       });
  //       clientSocket.on('connect', done);
  //     });
  //   });

  //   afterAll(() => {
  //     io.close();
  //     clientSocket.close();
  //   });
  let serverSocket, clientSocket;
  beforeAll((done) => {
    // server.listen(PORT, () => {
    //     console.log('Server is up . . . ');
    //     console.log(`Server is working at http://localhost:${port}`);
    //   });
    const port =process.env.PORT;
    server.listen(port, () => {

      //   const port = server.address().port;
      console.log('port',port);
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

  test('should work', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });

  test('should work (with ack)', (done) => {
    serverSocket.on('hi', (cb) => {
      cb('hola');
    });
    clientSocket.emit('hi', (arg) => {
      expect(arg).toBe('hola');
      done();
    });
  });
});
