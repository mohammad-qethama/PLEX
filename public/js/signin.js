'use strict';

// eslint-disable-next-line no-undef
$('#formSubmit').submit(function (e) {
  e.preventDefault();
  let url = '/signin';
  // eslint-disable-next-line no-undef
  let username = $('#un').val();
  // eslint-disable-next-line no-undef
  let password = $('#pw').val();

  let header = new Headers();

  header.append('Accept', 'application/json');
  header.append('Content-Type', 'application/json');
  let encoded = window.btoa(`${username}:${password}`);
  let auth = `Basic ${encoded}`;
  header.append('Authorization', auth);

  let req = new Request(url, {
    method: 'POST',
    headers: header,
    credentials: 'include',
  });
  fetch(req).then(async response => {
    let userObject = await response.json();
    console.log(userObject);
    let token = userObject.token;
    document.cookie = `token=${token}`;
    // if (response.ok) window.location = 'home.html';
    // else throw new Error('Bad HTTP request ');
  });
});
