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

// console.log('cookies',cookies);
socket.on('chat-message',payload=>{
  console.log('inside chat message');
  appendMessage(`${payload.theName} : ${payload.message}`);
});//
socket.emit('chat-connected',{
  payload: 'neveen :(',
});
function getCookie() {
  var arrayb = document.cookie.split(';');
  for (const item of arrayb) {
    if (item.startsWith('username=')){
      return item.substr(9);
    }
  }
}
function appendMessage (message){
  // const messageElement= document.createElement('div');
  const messageElement=$(`<div></div>`).text(message);
  // messageElement.textContent = message;
  $('#message-container').append(messageElement);
}
