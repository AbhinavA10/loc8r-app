# Loc8r
Angular app to find locations with wifi closeby.

Uses the MEAN stack: backend REST API built with Mongo, Express and Node.js
Frontend built with Angular

Uses Font-awesome and Bootstrap

## Project Structure

### app_server
- Backend Express Server API
- built with MVC architecture

## Env variables needed
- 



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
- add data to production db