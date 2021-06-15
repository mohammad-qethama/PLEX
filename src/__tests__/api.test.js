'use strict';
require('dotenv').config();
const supergoose =require('@code-fellows/supergoose');
const {app}=require('../server');
const {expect}= require('@jest/globals');
const request= supergoose(app);
let id;

let consoleSpy;
// const req = { method: 'get', path: 'test' };
// const res = {};
// const next = jest.fn();
beforeEach(() => {
  consoleSpy = jest.spyOn(console, 'log');//.mockImplementation();
});
afterEach(() => {
  consoleSpy.mockRestore();
});







describe('api test',()=>{
  it('should get All Event',async()=>{
    const res = await request.get('/getEvents');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([]);
  });
  it('should create new event',async()=>{
    const res = await request.post('/createEvent').send(
      {
        attendance_limit:10,
        city:'amman',
        catagories:'art',
      },
    );
    expect(res.status).toEqual(201);
    expect(res.body.city).toEqual('amman');
    id=res.body._id;
  });

  // it('should not create new event',async ()=>{
  //   const res = await request.post('/createEvent')
  //   jest.setTimeout(()=>{
  //     res.send(
  //       {
  //         attendance_limit:10,
  //         city:'amman',
  
  //       },
  //     );
  //     expect(res.status).toEqual(500);
            
  //        },10000)
  //      });

  it('should get event by id ',async()=>{
    const res= await request.get(`/getEvents/${id}`);
    expect(res.status).toEqual(200);
    expect(res.body.city).toEqual('amman');
  });
});

