'use strict';
const express = require('express');
const router = express.Router();

router.get('/', rootHandler);

function rootHandler(req, res) {
  res.send('root is working');
}
module.exports = router;
