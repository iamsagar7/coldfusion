const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config=require('./config/index');
const app = express();


//importing routes
var aboutRouter = require('./routes/about');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ideasRouter = require('./routes/ideas');



require('./db')(config);

require('./models/Idea');
var Idea = mongoose.model('ideas');

// Passport Config
require('./config/passport')(passport);

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Use routes
app.use('/ideas', ideasRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/', indexRouter);


// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
//error handler
app.use(function (err, req, res, next) {
  var status = err.status || 400;
  res.status(400).json({
    message: err.message || err
  });
});

app.listen(config.app.port, (err, done) => {
  if (err) {
    console.log(`We got an internal error connecting to port ${config.app.port}`);
  } else {
    console.log(`Sucessfully connected at  port  ${config.app.port}`);
  }

});

module.exports = app;