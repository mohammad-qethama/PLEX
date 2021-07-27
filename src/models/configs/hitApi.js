'use strict'

const superagent = require('superagent');
const Config = require('./model.js');
const DataMngr = require('../DataCollection.js');
const configMngr = new DataMngr(Config);
const base64 = require('base-64');



// window.onload = function () {
//   let xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function ($evt) {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       let res = JSON.parse(xhr.responseText);
//       console.log('response: ', res);
//     }
//   };
//   xhr.open('PUT', 'https://global.xirsys.net/_turn/fedora', true);
//   xhr.setRequestHeader(
//     'Authorization',
//     'Basic ' + btoa('ibrahimbanat:2a9ea248-cc3d-11eb-a6eb-0242ac150002')
//   );
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(JSON.stringify({ format: 'urls', expire: '3600' }));
// };

const hitApi = async ()=>{
  let bas = base64.encode('mohquth:8e5a1de6-edf6-11eb-b137-0242ac150003')
  superagent
    .put("https://global.xirsys.net/_turn/fedora")
      .set('Authorization' ,  'Basic ' + bas)
        .set('Content-Type', 'application/json')
          .send(JSON.stringify({ format: 'urls', expire: '3600' }))
          .then( async (data) => {
            // console.log(data.body.v);
            let arr = [{
              urls:data.body.v.iceServers.urls[0],

              },
              {
                urls:data.body.v.iceServers.urls[4],
                credential:data.body.v.iceServers.credential,
                username:data.body.v.iceServers.username,
                credentialType:'password'


              }
            ]
            
            let dataArr=await configMngr.get();
            if (!dataArr.length) await configMngr.deleteAll();
            let resObj = await configMngr.create({iceServers:arr});
            // console.log(resObj)
          }).catch(console.error)
};

// {
//   iceServers: {
//     username: 'gd-PxqA0IbR16zGLy_L9Lbgr9FV-Kzv2ndxjjqJOlH99tfyxKmbxGSrcVH-BV-AoAAAAAGEAQpxpYnJhaGltYmFuYXQ=',
//     urls: [
//       'stun:eu-turn3.xirsys.com',
//       'turn:eu-turn3.xirsys.com:80?transport=udp',
//       'turn:eu-turn3.xirsys.com:3478?transport=udp',
//       'turn:eu-turn3.xirsys.com:80?transport=tcp',
//       'turn:eu-turn3.xirsys.com:3478?transport=tcp',
//       'turns:eu-turn3.xirsys.com:443?transport=tcp',
//       'turns:eu-turn3.xirsys.com:5349?transport=tcp'
//     ],
//     credential: '479f3f3e-ef00-11eb-bc39-0242ac140004'
//   }
// }
/* ***********************************/

// const config = {
//   iceServers: [
//     {
//       urls: 'stun:us-turn8.xirsys.com',
//     },
//     {
//       urls: 'turn:us-turn8.xirsys.com:3478?transport=tcp',
//       credential: '92f1e7da-cf33-11eb-b4da-0242ac140004',
//       username:
//         'rBsN8vEH9R6S1z7ZWvq-UiP5dTxxoCzmcpN3F_NDpmuL8XjcManv4pawQPQfeysQAAAAAGDK6MZpYnJhaGltYmFuYXQ=',
//       credentialType: 'password',
//     },
//   ],
// };


module.exports = hitApi;