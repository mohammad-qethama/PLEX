'use strict';
const supergoose = require('@code-fellows/supergoose');
const {app}  = require('../server.js');
const googleOauth = require('../auth/middlewares/googleAuth.js');
const mockRequest = supergoose(app);
//email:plexgroupjs@gmail.com /123456789plex$
describe('Google Oauth Middleware', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();
  describe('user authentication', () => {
    it('fails a login for a user  with incorrect basic credentials', () => {
      // Change the request to match this test case
      req.cookies=`session-token eyJhbGciOiJSUzI1NiIsImtpZCI6IjZhMWQyNmQ5OTJiZTdhNGI2ODliZGNlMTkxMWY0ZTlhZGM3NWQ5ZjEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNzcyODQ4ODYzMzIzLTk5Z3R0b2U5dGUxM251anY3bTNwYjc5YTFlOThkdmRzLmFwcHMuZ29vZ2xldXNlcmNvbnRl`;
      return googleOauth(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.payload).toBeNull;
        });
    });
  });
  it('Should not access the protected area', async () => {
    const googleResponse = await mockRequest
    jest.setTimeout(()=>{
 googleResponse  
.get('/protected')
      // .set('Authorization', `Bearer foobar`); 
        expect(googleResponse.status).toBe(403);
    },1000)
  });
});