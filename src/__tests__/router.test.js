'use strict';

const {expect}= require('@jest/globals');
const {app} = require ('../server.js');
const supergoose =require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const router = require ('../Router.js');
process.env.SECRET = 'toes';



describe ('404 error' , ()=>{
  it ('should return 404 error' , async ()=>{
    const response = await mockRequest
    .get('/test/test')
    expect(response.status).toBe(404);
  })
})

describe ('root test' , ()=>{
  it ('should get the root route' , async ()=>{
    // const mock = jest.fn();
    const response = await mockRequest.get ('/')

    expect (response.status).toBe (200)
  
  })
})
  let theUser;
  let id;
beforeAll(async () => {
  const u = {
    username: 'farah',
    password: '123',
    role:'admin'
  }

   await mockRequest.post('/signup').send(u);
   theUser =await mockRequest.post('/signin').auth(u.username, u.password);
console.log('the user*****', theUser.body);
await mockRequest.post('/ctreatRoom')
.set('Accept-Language', 'en')
.set('Content-Type', 'application/json')
.set('Cookie', [`token=${theUser.body.token}`,'username=farah'])

});  

describe ('user route test' , ()=>{


  it ('should get users' , async ()=>{
    // const mock = jest.fn();
    const response = await mockRequest.get('/user')
    .set('Accept-Language', 'en')
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${theUser.body.token}`,'username=farah'])

    expect (response.status).toBe (200)
  });
 

  it ('should get users' , async ()=>{
    // const mock = jest.fn();
    const response = await mockRequest.get('/logout')
    .set('Accept-Language', 'en')
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${theUser.body.token}`,'username=farah'])

    expect (response.status).toBe (302)
  });

  it ('should get create a room' , async ()=>{
   
    const response = await mockRequest.post('/ctreatRoom')
    .set('Accept-Language', 'en')
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${theUser.body.token}`,'username=farah'])
    expect (response.status).toBe (302)
    id = response.headers.location;
  });

  it ('should get room' , async ()=>{
  
    const response = await mockRequest.get(`${id}`)
    .set('Accept-Language', 'en')
    .set('Content-Type', 'application/json')
    .set('Cookie', [`token=${theUser.body.token}`,'username=farah'])
    expect (response.status).toBe (200)
  }); 

})