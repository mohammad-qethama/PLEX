'use strict';
const server = require('./src/server');
//Import the mongoose module
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const mongooseUri = process.env.MONGOOSE_URI;
const cron = require('node-cron')
const crontab = require('node-crontab')
const hitApi = require('./src/models/configs/hitApi.js');

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




mongoose
  .connect(mongooseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {

    crontab.scheduleJob("0 */3 * * *" , function(){
      hitApi()
        },{
    schedule: true,
    timezone: "Asia/Kuwait"
    });
    
 

    server.start(PORT);
    hitApi();

  });
