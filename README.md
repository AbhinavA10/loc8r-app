# Loc8r
Angular app to find locations with wifi closeby.

Uses the MEAN stack: backend REST API built with Mongo, Express and Node.js
Frontend built with Angular

Uses Font-awesome and Bootstrap

## Project Structure
When you go to my website, you contact the app_server directly.

### app_server
- Backend Express Server API
- built with MVC architecture
- when you go to my website, the controller in `/app_server` makes requests to `/app_api`
- CORS headers enabled on API routes so Angular front-end can make requests

### app_api
- REST API for CRUD operations on MongoDB
- used as a backend for Angular Frontend, to interface with mongo
- decoupled into a seperate folder in case we need to move it to another server
- to test the api, use Postman
- URL parameters are accessed using `req.params`
- query strings are accessed via `req.query`
- posted form data accessed via `req.body`
- user password is saved in database after hashing with cryptographically secure salt and `pbkdf2`
- uses JWTs to authenticate users between API and SPA using `passport`'s `LocalStrategy`. This provides a stateless authentication solution.
    - 'new review' endpoints are limited to authenticated users only

### app_public
Angular Front end SPA
- Angular applications are built with components, which are compiled into modules
- A component handles a specific piece of functionality, and a module contains one or more components working together
- service makes the api requests
- geolocation service uses native HTML5 geolocation function to get lat/lng of user
- uses Angular's router to navigate between pages
- JWT is saved in `localStorage`

## .Env variables needed
- `googleAPIKey` in `location-details.component.ts` in `app_public/`
- JWT_SECRET

In production mode only:
- `MONGODB_URI=<insert here>`
- `NODE_ENV=production`

## REST API
- stateless api
- used to interface controller code with mongo
- APIs should always return HTTP status codes
- returning json data is most friendly
- CRUD
- `GET, POST, PUT, DELETE`

### GET
- to retreive data
- return the data requested

### POST
- a request to create a resource (document)
- should return the saved data as a confirmation

### PUT
- for updating existing documents/subdocuments in db
- should return saved data as a confirmation
- these still get data from form posted to them, like POST

### DELETE

## Heroku
Testing heroku env locally:
```
heroku local
```
This runs it on `localhost:5000`

Deploying changes to live heroku in web
``` bash
git push heroku master
# or
git push -f heroku HEAD:master # to push a local branch to another master
```

To open url for app
```
heroku open
```

TODO:
- get google maps static api key

## Mongoose Notes
if we make changes to the instance returned by a mongoose query, and then save it, Mongoose will update the original document in the database

## JWT Notes
`Header.Payload.Signature`
- Header: An encoded JSON object containing the type and the hashing algorithm
used
- Payload: encoded JSON object containing the data, the real body of the
token
- Signature: an encrypted hash of the header and payload, using a secret that
only the originating server knows
- https://medium.com/swlh/a-practical-guide-for-jwt-authentication-using-nodejs-and-express-d48369e7e6d4
- https://hptechblogs.com/using-json-web-token-for-authentication/