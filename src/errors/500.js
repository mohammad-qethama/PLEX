'use strict';

module.exports = (err, req, res, next) => {
  res.status(500).json({
    status: 500 || err.status,
    message: err.message || err,
    route: req.patch,
  });
};
