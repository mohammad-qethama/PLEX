'use strict';

module.exports = (req, res, next) => {
  try {
    let token = req.cookies['token'] || req.cookies['session-token'];
    console.log(token);
    token ? next() : res.redirect('/signin.html');
  } catch (error) {
    res.status(403).json('Acess Denied');
  }
};
