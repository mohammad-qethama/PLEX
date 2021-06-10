'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', rootHandler);

router.get('/:id', roomHandler);

function rootHandler(req, res) {
  res.send('root is working');
}
function roomHandler(req, res) {
  res.sendFile('room.html', { root: path.join(__dirname, '../public') });
}
module.exports = router;
