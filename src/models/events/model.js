'use strict';
const mongoose = require('mongoose');


let Event =new  mongoose.Schema(
  {
    name:{type:String,required:true},
    description:{type:String},
    from:{type:String,required:true },
    end : {type:String,required:true },
    attendance_limit:{type : Number ,required:true , default:0}, 
    address :{type: String ,required:true},
    catagories:{type:String, required:true},
    type:{type:String ,enum:['online','real_word'],default:'online',required:true},
    privacy:{type:String ,enum:['private','public'],default:'public',required:true},
    room_owner:{type:String,required:true,},
    roomId: { type: String  },
    password : { type: String  },
  },
);

const EventModel = mongoose.model('Event', Event);
module.exports = EventModel;