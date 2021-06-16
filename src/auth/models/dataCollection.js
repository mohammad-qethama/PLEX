'use strict';

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  get(_id) {
    if (_id) {
      return this.model.findOne({ _id });
    } else {
      return this.model.find({});
    }
  }
  create(record) {
    let newRecord = new this.model(record);
    return newRecord.save();
  }
}
module.exports = DataCollection;
