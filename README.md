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
![uml](./public/assets/UML-PLEX.png)

[for more clear view click here](https://lucid.app/lucidspark/invitations/accept/inv_4f5cc904-4a6d-456b-9c7a-70386560deed?viewport_loc=-2121%2C-517%2C3841%2C1758%2C0_0)