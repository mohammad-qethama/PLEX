'use strict';

module.exports = (req, res, next) => {
  try {
    let token = req.cookies['token'];
    console.log(token);
    token ? next() : res.redirect('/signin');
  } catch (error) {
    console.log(error);
  }
};
