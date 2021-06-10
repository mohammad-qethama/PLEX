'use strict';

const socket = io();
const peer = new Peer({
  host: 'plex-jo.herokuapp.com/', // exclude protocol
  secure: true,
});
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
let room = window.location.href.split('/')[3];
const peers = {};
myVideo.muted = true;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then(stream => {
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream);
    });
  });

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
});

peer.on('open', id => {
  console.log(room);
  socket.emit('join-room', room, id);
});

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}
