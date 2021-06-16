# Plex (Events Website Software)
## Team members : 
* Ibrahim Banat ( Team leader )
* Tamara Al-rashed 
* Neveen Beiram
* Mohammad Quthama
* Tamara Al-billeh
## Summary of the Idea 
A web app that enables you to view and attend upcoming events as well as creating your own, users can host events on the app where they can share their screens and cameras.
## Problem domain 
We need a website to view a wide range of events to attend even if they are public or private, and for those who want to host an event and invite people to attend it, Plex can help to find those events easily.
Software Requirements
## Vision
to give our clients one place to stay informed of virtual online events taking place at each given moment , and to give our clients a platform to share their experiences with others.
## Domain modeling 
![img](https://f.top4top.io/p_1987hx8x31.png)
## User Stories
- As a user, I want rooms to handle my events, and chat through videos.
- As an admin for the event I created,, I want to have the ability of controlling my event. 
- As a user, I want to have a list of events  that will happen.
## Developer Stories
1. As a developer, I want to have the ability to sign in using regular sign in and using oath.
2. As a developer I want to have my own api for events, and the user can publish events to the api.
## Database Schema Diagram
We will use two schema :users, and events.Both are not relational, the 'users' schema will be used for saving the users' usernames, passwords, and roles.
For 'events' schema, it will be used for the events created and will have the needed data for event like name, description, room owner, and other data, check the diagram below.
![img](./public/assets/dataBase.JPG)
## Wireframe
![img](./public/assets/home-wireframe.png)
<br>
![img](./public/assets/signin-wireframe.png)
<br>
![img](./public/assets/events-wireframe.png)
<br>
![img](./public/assets/video-wireframe.png)
<br>
![img](./public/assets/attend-event-wireframe.png)

## UML :

![img](https://k.top4top.io/p_1993olivn1.png)

[for more clear view click here](https://lucid.app/lucidspark/invitations/accept/inv_4f5cc904-4a6d-456b-9c7a-70386560deed?viewport_loc=-2121%2C-517%2C3841%2C1758%2C0_0)

***
## Running the app

- `npm start`

* [deployment for main branch](http://plex-jo.herokuapp.com/) .

### Setup

#### `.env` requirements

- `PORT` 3000
- `MONGOOSE_URI`
- `SECRET`
- `CLIENT_ID`
- `CLIENT_SECRET`

### Endpoints
- Endpoint: get `/`
  - Gets the root rout "index.html"

  ```

  "root is working"

  ```
- Endpoint: post `/signup`
  - Enters the password and username and store them to database 

  ```

    redirect to '/signin.html'

  ```

- Endpoint: post `/signin`
  - Sign in the user after comparing provided info with previously stored info . 

  ```

    {
    "user": {
        "role": "user",
        "_id": "60c9e31558c5080015935244",
        "username": "siri",
        "createdAt": "2021-06-16T11:40:05.486Z",
        "updatedAt": "2021-06-16T11:40:05.486Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNpcmk1NSIsImlhdCI6MTYyMzg0MzYzM30.fBMU_fQpsbfbMgBhkpedYa0g0TIQWMuBLDHfYq0lKGs"
    }
  

      +  redirect to '/home.html'



  ```
- Endpoint: post `/login`
  - Sign in the user using google oauth and store the info in the data base 

  ```

    redirect to '/home.html'

  ```
- Endpoint: post `/logout`
  - log the user out of the webapp and redirect to the index  

  ```

    redirect to '/index.html'

  ```
- Endpoint: post `/ctreatRoom`
  - creates a room for the events   

  ```

    redirect to '/broadcaster.html'

  ```
- Endpoint: get `/:id`
  - to enter a specific room by its id    

  ```
    if broadcaster : redirect to '/broadcaster.html'
    if watcher : redirect to '/watcher.html'

  ```
- Endpoint: get `/events`
  - gets an array of all the events stored in the database     

  ```
    [
    {
        "attendance_limit": 40,
        "type": "online",
        "_id": "60c8ed90ee46cb00154a6cd2",
        "name": "the next radio technoliges",
        "description": "a look at the 6g technoliges",
        "from": "18-6-2021",
        "end": "21-6-2021",
        "address": "PLEX frence rooms",
        "catagories": "radio networks",
        "room_owner": "sivir",
        "__v": 0
    },
    ]

  ```
- Endpoint: get `/events/:id`
  - gets an event by its id    

  ```
    [
    {
        "attendance_limit": 40,
        "type": "online",
        "_id": "60c8ed90ee46cb00154a6cd2",
        "name": "the next radio technoliges",
        "description": "a look at the 6g technoliges",
        "from": "18-6-2021",
        "end": "21-6-2021",
        "address": "PLEX frence rooms",
        "catagories": "radio networks",
        "room_owner": "sivir",
        "__v": 0
    },
    ]

  ```
- Endpoint: post `/events`
  - creates an event by sending an object with the info to the database   

  ```
    
    {
        "attendance_limit": 40,
        "type": "online",
        "_id": "60c8ed90ee46cb00154a6cd2",
        "name": "the next radio technoliges",
        "description": "a look at the 6g technoliges",
        "from": "18-6-2021",
        "end": "21-6-2021",
        "address": "PLEX frence rooms",
        "catagories": "radio networks",
        "room_owner": "sivir",
        "__v": 0
    },
    returns the info of the created event

  ```
- Endpoint: put `/events/:id`
  - updates an existing event if you have the permission   

  ```
    
    {
        "attendance_limit": 1,
        "type": "online",
        "_id": "60c8ed90ee46cb00154a6cd2",
        "name": "the next radio technoliges",
        "description": "a look at the 6g technoliges",
        "from": "18-6-2021",
        "end": "21-6-2021",
        "address": "PLEX frence rooms",
        "catagories": "radio networks",
        "room_owner": "sivir",
        "__v": 0
    },
    returns the info of the updated event

  ```
- Endpoint: delete `/events/:id`
  - deletes an existing event if you have the permission   

  ```
    
    {
        "attendance_limit": 1,
        "type": "online",
        "_id": "60c8ed90ee46cb00154a6cd2",
        "name": "the next radio technoliges",
        "description": "a look at the 6g technoliges",
        "from": "18-6-2021",
        "end": "21-6-2021",
        "address": "PLEX frence rooms",
        "catagories": "radio networks",
        "room_owner": "sivir",
        "__v": 0
    },
    returns the info of the deleted event

  ```
- Endpoint: get `/foo/foo`
  - returns a 404 status page not found  

  ```
    
    {
    "status": 404,
    "message": "seems like beheemoth took the file to the upside down, file does not exist right now"
    }

  ```

#### Tests

- Unit Tests: `npm run test`

![tests](public/assets/pelxtest.PNG)
