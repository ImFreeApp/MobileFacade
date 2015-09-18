# MobileFacade
Mobile Facade is a master services that speaks to both the user and geo services
It is meant for communications via a mobile device. For a Web client, see Web Facade.

This is a general service built only to access other, sub services.

###

Setup

```bash
npm install
nodemon server.js
```

Routes
```
POST: /api/auth/facebook
Auth for facebook. 
Requires JSON with token id from facebook
```

```
POST /api/auth/checkins/addcheckin
Adds location of user.
Requires lat, long, in JSON

GET /api/auth/checkins/getcheckins
Gets nearby user objects
Requires distance (in mi) as a url param
eg: /api/auth/checkins/getcheckins?distance=# of miles
```
