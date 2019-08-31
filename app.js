require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
// best practice: connect to mongoose as soon as app loads
require('./app_api/models/db'); // connect to mongo and mongoose and load models
require('./app_api/config/passport'); // configure passport local strategy

// const indexRouter = require('./app_server/routes/index'); // for express and pug front end
const apiRoutes = require('./app_api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

//middleware
if (!(process.env.NODE_ENV === 'production')) {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // takes incoming request and puts cookie info in req instead
app.use(express.static(path.join(__dirname, 'public'))); // find static files, such as css
app.use(express.static(path.join(__dirname, 'app_public', 'build'))); // to reference the built angular files

app.use(passport.initialize()); // add passport as middleware

// Enable CORS so Angular front-end can make api requests
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // allows cors for this url
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // for preflight requests, to let api caller know which HTTP headers are valid
  next();
});

// app.use('/', indexRouter); // for express and pug front end
app.use('/api', apiRoutes);
app.get(/(\/about)|(\/location\/[a-z0-9]{24})/, function (req, res, next) { // use regex to match urls
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

// --- Error handlers ---

// Catch 'unauthorized' errors -> 'auth' middleware in review api routes throws error when token is invalid
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ "message": err.name + ": " + err.message });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
