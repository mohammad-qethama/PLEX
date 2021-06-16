'use strict';
require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const { app } = require('../server');
const { expect } = require('@jest/globals');
const request = supergoose(app);
process.env.SECRET = 'toes';
const Events = require('../models/events/model');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const events = {
  name: 'nevEvent',
  from: 'today',
  end: 'tomorrow',
  attendance_limit:30, 
  type:'online',
  address: 'amman',
  catagories: 'art',
  room_owner: 'testneveen'
};
let id;
let theUser;
beforeAll(async () => {
  const u = {
    username: 'tamara101',
    password: '123',
    role: 'admin'
  }

   await request.post('/signup').send(u);
   theUser =await request.post('/signin').auth(u.username, u.password);

  
});

describe('api test', () => {

  // it('should get All Event', async () => {
  //   const res = await request;
  //   jest.setTimeout(() => {
  //     res.get('/events')
  //     expect(res.status).toEqual(200);
  //     expect(res.body).toBe([])
  //   }, 1000)
  // });


  it('should create new event', async () => {
   
    const res = await request.post('/events')
    .set('Accept-Language', 'en')
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${theUser.body.token}`,'username=tamara101'])
    
    .send(
      {
        name: 'tamEvent',
        from: 'today',
        end: 'tomorrow',
        attendance_limit:30, 
        type:'online',
        address: 'amman',
        catagories: 'art',
        
      },
    )
  
    expect(res.status).toBe(201);
    
    expect(res.body.name).toEqual('tamEvent');
    id = res.body._id;
  });
  it('should get Events',async()=>{
    const res = await request;
    jest.setTimeout(()=>{
  res.get( `/events`)
  expect(res.status).toEqual(200);
   console.log('the body******',res.body);
   expect(res.body[0].name).toEqual('tamEvent');
  expect(res.body[0].name).toEqual('tamEvent');
          },1000)
         
  });


  it('should get Event by id',async()=>{
    const res = await request;
    jest.setTimeout(()=>{
  res.get( `/events/${id}`)
  expect(res.status).toEqual(200);
  expect(res.body.name).toEqual('tamEvent');
          },1000)
  });




  it('should update event by id ',async()=>{
    const res= await request.put(`/events/${id}`)
    .set('Accept-Language', 'en')
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${theUser.body.token}`,'username=tamara101'])
    .send({
      attendance_limit:5,
      city:'irbid',
      catagories:'art',
    });
    expect(res.body.attendance_limit).toEqual(5);
    expect(res.status).toEqual(200);
  });

  it('should delete event by id ',async()=>{
    const res= await request.delete(`/events/${id}`)
    .set('Accept-Language', 'en')
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${theUser.body.token}`,'username=tamara101'])
    
    expect(res.body.attendance_limit).toEqual(5);
    expect(res.status).toEqual(200);
  });

});

