const express = require('express');
const router = express.Router();
const DataMngr = require('../models/DataCollection.js');
const Configs = require('../models/configs/model.js');
const configsMngr = new DataMngr(Configs);


router.get('/',getHandlerList);


 async function getHandlerList (req,res,next){

   try {
    let dataArr = await configsMngr.get();
    res.status(200).json(dataArr[0]);
 } catch (error) {
     next(error);         
 }





}

module.exports = router;
