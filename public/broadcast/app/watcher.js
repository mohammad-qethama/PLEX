'use strict';

let peerConnection;
const roomIdFromUrl = window.location.href;
const actualRoomId = roomIdFromUrl.split('/')[3];
const config = {
  iceServers: [
    {
      urls: 'stun:us-turn8.xirsys.com',
    },
    {
      urls: 'turn:us-turn8.xirsys.com:3478?transport=tcp',
      credential: '37eb9e7e-cce2-11eb-95a4-0242ac140004',
      username:
        'G40rsOuiwvtiWk2oZVZMCG_ZhPvc50GymscI-33xH1V8CaZ1Vt4KASOSxZ6uDPASAAAAAGDHBUlpYnJhaGltYmFuYXQ=',
      credentialType: 'password',
    },
  ],
};

const socket = io.connect(window.location.origin);
const video = document.querySelector('video');
const enableAudioButton = document.querySelector('#enable-audio');

enableAudioButton.addEventListener('click', enableAudio);
socket.emit('join-room', actualRoomId);
socket.on('offer', (id, description) => {
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit('answer', id, peerConnection.localDescription);
    });
  peerConnection.ontrack = event => {
    video.srcObject = event.streams[0];
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('candidate', id, event.candidate);
    }
  };
});
// experimental aria webRTC STUN AND TERN  approach //check public broadcast.
socket.on('candidate', (id, candidate) => {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

socket.on('connect', () => {
  console.log(actualRoomId);
  socket.emit('watcher', actualRoomId);
});

socket.on('broadcaster', roomId => {
  console.log(roomId);
  socket.emit('watcher', roomId);
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
};

function enableAudio() {
  console.log('Enabling audio');
  video.muted = false;
}
