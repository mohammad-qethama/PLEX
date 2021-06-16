'use strict';

module.exports = (req, res, next) => {
  res.status(404).json({
    status: 404,
    message:
      'seems like beheemoth took the file to the upside down, file does not exist right now',
  });
};
