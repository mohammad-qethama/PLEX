'use strict';
const mongoose = require('mongoose');


let Event =new  mongoose.Schema(
  {
    from:{type: Date, default: Date.now ,required:true},
    end : {type: Date ,default:Date.now ,required:true},
    attendance_limit:{type : Number ,required:true}, 
    city :{type: String ,required:true},
    catagories:{type:String,enum:['art','tech'] ,required:true},
    location:{type:String ,enum:['online','real_word'],default:'online',required:true},
    room_owner:{type:String,required:true,default:'admin'},
  },
);

const EventModel = mongoose.model('Event', Event);
module.exports = EventModel;