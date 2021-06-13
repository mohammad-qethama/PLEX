'use strict';

const socket=io();

// $('#message-container');

const cookies=getCookie();
appendMessage('You are connected');
socket.on('test2',()=>{
  socket.emit('newUser',cookies);
});

socket.on('chat-user-connected',payload=>{
  appendMessage(`${payload.name} : connected at ${payload.time} 🕒`);
});


$('#send-container').on('submit',function(e) {
  e.preventDefault();
  const message=$('#message-input').val();
  appendMessage(`You: ${message}`);
  socket.emit('message',{theName:cookies,message:message});
  $('#message-input').val('');
});

