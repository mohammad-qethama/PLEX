'use strict';
const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  iceServers:{type:Array,required:true}
})

const Config =  mongoose.model('configuration',ConfigSchema)

module.exports = Config ;



