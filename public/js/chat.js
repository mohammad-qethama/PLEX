'use strict';

const socket=io();

// $('#message-container');
let ID=[];
const cookies=getCookie();
appendMessage('You are connected');

socket.on('test2',(payload)=>{
  ID.push(payload);
  //  console.log('palyoad ID', ID);
  socket.emit('newUser',{cookies:cookies,chatId:payload});
});

socket.on('old-messages',payload=>{
  console.log('keys',payload[ID[0]]);
  if (payload[ID[0]]){
    payload[ID[0]].map(item=>{
      if(item.name===cookies){
        appendMessage(`You : ${item.message}`);
      }
      else{
        appendMessage(`${item.name} : ${item.message}`);
      }
    });
  }
});

socket.on('chat-user-connected',payload=>{

  appendMessage(`${payload.name} : connected at ${payload.time} 🕒`);
});


$('#send-container').on('submit',function(e) {
  e.preventDefault();
  // console.log('ID******',ID[0]);
  const message=$('#message-input').val();
  appendMessage(`You: ${message}`);
  socket.emit('message',{theName:cookies,message:message,chatId:10});
  $('#message-input').val('');
  // ID.pop();
});

// console.log('cookies',cookies);
socket.on('chat-message',payload=>{
  // console.log('inside chat message');
  appendMessage(`${payload.theName} : ${payload.message}`);
});//





function getCookie() {
  let arrayb = document.cookie.split(';');
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
