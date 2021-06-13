'use strict';

let peerConnection;
const config = {
  iceServers: [
    {
      urls: 'stun:us-turn8.xirsys.com',
    },
    {
      urls: 'turn:us-turn8.xirsys.com:3478?transport=tcp',
      credential: 'c81bdfba-cc6d-11eb-8738-0242ac140004',
      username:
        'EepBgut8KBeAQd9qFoFsV5ELdcoctdO-p4jfVl1-l8_jd4u7HK2_-3-LFda2ygwYAAAAAGDGQfBpYnJhaGltYmFuYXQ=',
      credentialType: 'password',
    },
  ],
};

const socket = io.connect(window.location.origin);
const video = document.querySelector('video');
const enableAudioButton = document.querySelector('#enable-audio');

enableAudioButton.addEventListener('click', enableAudio);

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
  socket.emit('watcher');
});

socket.on('broadcaster', () => {
  socket.emit('watcher');
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
};

function enableAudio() {
  console.log('Enabling audio');
  video.muted = false;
}
