'use strict';

// eslint-disable-next-line no-undef
$('#formSubmit').submit(function (e) {
  e.preventDefault();
  let url = '/signin';
  // eslint-disable-next-line no-undef
  let username = $('#un').val();
  // eslint-disable-next-line no-undef
  let password = $('#pw').val();
  //settign a new inctance of api fetch for headers
  let header = new Headers();

  //appending new headers to the request
  header.append('Accept', 'application/json');
  header.append('Content-Type', 'application/json');

  //encoding the username and the password for the user
  let encoded = window.btoa(`${username}:${password}`);
  let auth = `Basic ${encoded}`;

  //setting authorization headers
  header.append('Authorization', auth);

  //making a new request with the new headers
  let req = new Request(url, {
    method: 'POST',
    headers: header,
    credentials: 'include',
  });
  // fetching the server and waiting for response
  fetch(req).then(async response => {
    let userObject = await response.json();

    //saving user token inside the browser cookies
    let token = userObject.token;
    document.cookie = `token=${token}`;

    // if the there is not error with the response redirect the user to the homepage
    if (response.ok) window.location = 'home.html';
    else throw new Error('Bad HTTP request ');
  });
});
