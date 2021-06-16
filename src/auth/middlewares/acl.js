'use strict';
const Events = require('../../models/events/model.js');

module.exports = capability => {
  return async (req, res, next) => {
    const id = req.params.id;

    try {
      let owner;
      if (id) {
        let document = await Events.findById(id);
        owner = document.room_owner;
      }

      if (
        req.user.capabilities.includes(capability) ||
        req.user.username === owner
      ) {
        next();
      } else {
        next('Access Denied');
      }
    } catch (e) {
      next(e);
    }
  };
};
