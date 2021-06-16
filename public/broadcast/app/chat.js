'use strict';

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const name = getCookie();
let today = new Date();
let time = today.getHours() + ':' + today.getMinutes();
let room = window.location.href.split('/')[3];

socket.on('old_massage', payload => {
  console.log('dd');
  console.log(payload.message);
  if (payload.message === 0) {
    appendMessage(`You joined 🕜 ${time}`);
    socket.emit('new-user', { name: name, roomId: room });
  }
  if (payload.message) {
    payload.message.forEach(element => {
      appendMessage(`${element.name}: ${element.message} 🕜 ${element.time} `);
    });
  }

  // appendMessage(`${payload.name} :${payload.message}-------- `);
});
appendMessage(`You joined 🕜 ${time}`);
socket.emit('new-user', { name: name, roomId: room });

socket.on('user-connected', payload => {
  appendMessage(`${payload.name} is connected  🕜 ${payload.time}`);
});
socket.on('user-disconnected', payload => {
  appendMessage(`${payload.name} disconnected  🕜 ${payload.time}`);
});
socket.on('chat-message', data => {
  // console.log('----------------------------------------',data);
  appendMessage(`${data.name}: ${data.message} 🕜 ${data.time}`);
});
messageForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log('form is working');
  const message = messageInput.value;
  var timeHour = time;
  appendMessage(`You: ${message} 🕜 ${timeHour}`);
  socket.emit('send-chat-message', { message: message, roomId: room });
  messageInput.value = '';
});
appendMessage;
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
