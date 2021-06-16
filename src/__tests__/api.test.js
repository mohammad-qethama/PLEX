'use strict';
require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const { app } = require('../server');
const { expect } = require('@jest/globals');
const request = supergoose(app);
process.env.SECRET = 'toes';
const Events = require('../models/events/model');
const jwt = require('jsonwebtoken');

const events = {
  name: 'nevEvent',
  from: 'today',
  end: 'tomorrow',
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
  theUser = await request.post('/signup').send(u);

  await request.post('/signin').auth(u.username, u.password);
})


describe('api test', () => {

  it('should get All Event', async () => {
    const res = await request;
    jest.setTimeout(() => {
      res.get('/events')
      expect(res.status).toEqual(200);
      expect(res.body).toBe([])
    }, 1000)
  });


  // it('should create new event', async () => {
  //   const res = await request.post('/events').send(
  //     {
  //       name: 'tamEvent',
  //       from: 'today',
  //       end: 'tomorrow',
  //       address: 'amman',
  //       catagories: 'art',
  //       room_owner: 'tamara101'
  //     },
  //   )
  //   .set('Cookie', [`token=${theUser.token}`])
  //   console.log('test the User***',theUser);
  //   expect(res.status).toBe(201);
    
  //   expect(res.body.name).toEqual('nevEvent');
  //   id = res.body._id;
  // });
  // it('should get Event by id',async()=>{
  //   const res = await request;
  //   jest.setTimeout(()=>{
  // res.get( `/events/${id}`).cookies('token',token)
  // expect(res.status).toEqual(200);
  //        },1000)
  // });


  // it('should get event by id ',async()=>{
  //   const res= await request.get(`/getEvents/${id}`);
  //   expect(res.status).toEqual(200);
  //   expect(res.body.city).toEqual('amman');
  // });

  // it('should update event by id ',async()=>{
  //   const res= await request.put(`/getEvents/${id}`).send({
  //     attendance_limit:5,
  //     city:'amman',
  //     catagories:'art',
  //   });
  //   expect(res.body.attendance_limit).toEqual(5);
  //   expect(res.status).toEqual(200);
  // });


});

