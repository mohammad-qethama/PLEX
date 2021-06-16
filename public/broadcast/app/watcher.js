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
      credential: 'd7c5ae54-ce7b-11eb-8a9c-0242ac140004',
      username:
        'Fhr_4X5b1w2YQxb7BYELMmZKffKE934fcbRaPbPwPOrKk1BemW1-hZlvdI2lLEfxAAAAAGDJtIZpYnJhaGltYmFuYXQ=',
      credentialType: 'password',
    },
  ],
};
const cookies = getCookie();
const socket = io.connect(window.location.origin);
const video = document.querySelector('video');
const enableAudioButton = document.querySelector('#enable-audio');
const disableAudioButton = document.querySelector('#disable-audio');

enableAudioButton.addEventListener('click', enableAudio);
disableAudioButton.addEventListener('click', disableAudio);
socket.emit('join-room', { roomId: actualRoomId, cookies: cookies });
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
  let username = getCookie();
  console.log(actualRoomId);
  socket.emit('watcher', actualRoomId);
  socket.emit('add-connected', { username, actualRoomId });
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
function disableAudio() {
  console.log('Enabling audio');
  video.muted = true;
}
function getCookie() {
  console.log(document.cookie);
  var arrayb = document.cookie.split('; ');
  // console.log('from get cookies:', arrayb);
  for (const item of arrayb) {
    if (item.startsWith('username=')) {
      console.log(item);
      return item.substr(9);
    }
    // if (item.startsWith(' username=')) {
    //   console.log(item.substr(10));

    //   return item.substr(10);
    // }
  }
}
