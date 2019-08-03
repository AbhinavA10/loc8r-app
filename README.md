# Loc8r
Angular app to find locations with wifi closeby.

Uses the MEAN stack: backend REST API built with Mongo, Express and Node.js
Frontend built with Angular

Uses Font-awesome and Bootstrap

## Project Structure

### app_server
- Backend Express Server API
- built with MVC architecture

### app_api
- REST API for MongoDB
- used to interface static Express website with Mongo
- decoupled into a seperate folder in case we need to move it to another server
- to test the api, use Postman

## Env variables needed

For Development mode:
- 

In production mode:
- MONGODB_URI
- NODE_ENV

## REST API
- stateless api
- used to interface controller code with mongo
- APIs should always return HTTP status codes
- returning json data is most friendly
- CRUD
- GET, POST, PUT, DELETE

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