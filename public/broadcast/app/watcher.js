'use strict';

let peerConnection;

const roomIdFromUrl = window.location.href;
const actualRoomId = roomIdFromUrl.split('/')[3];
// taking the room id from the url 

const config = {
  iceServers: [
    {
      urls: 'stun:us-turn8.xirsys.com',
    },
    {
      urls: 'turn:us-turn8.xirsys.com:3478?transport=tcp',
      credential: '6d9541b6-ce8f-11eb-9636-0242ac140004',
      username:
        'qkLf5kwAmafNw6BSRFvxfuyf7aAO2rt_agCKXKRd-wYc1kLcIB0Ol5A6GAOp1BeQAAAAAGDJ1WFpYnJhaGltYmFuYXQ=',
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
// resiving an  peer-to-peer offer from the broadcaster via the socket.io-express server  with the ip and the offer description 
socket.on('offer', (id, description) => {

  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit('answer', id, peerConnection.localDescription);
      // it will create new peer connection and read the remote description prepare an answer to it then emmits its own connection description to the broadcaster via the socket io
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
//  Creating an ICE candidate from the broadcaster SDP  that  describes the protocols and routing needed for WebRTC to be able to communicate with a remote device.
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
// retrive the broadcaster roomID and emit it to the `watcher` listner on the server.js with its own room id//the should be the same roomID
socket.on('broadcaster', roomId => {
  console.log(roomId);
  socket.emit('watcher', roomId);
});
// close on socket/peer connection on closing/refreshing the window 

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
};
// enable stream audio button event handler
function enableAudio() {
  console.log('Enabling audio');
  video.muted = false;
}
// disable stream audio button event handler

function disableAudio() {
  console.log('Enabling audio');
  video.muted = true;
}
// get the username from the cookies

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
