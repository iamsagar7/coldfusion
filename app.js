var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config/index')
var mongoose = require('mongoose');

//importing routes
var aboutRouter = require('./routes/about');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//load idea model
require('./models/Idea');
var Idea = mongoose.model('ideas');


require('./db')(config);
var app = express();
var exphbs = require('express-handlebars');
// view engine setup
app.engine('handlebars', exphbs({
  defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

// Index Route
app.use('/', indexRouter);

// About Route
app.use('/about',aboutRouter);


// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});
app.listen(config.app.port, (err, done) => {
  if (err) {
    console.log(`We got an internal eroor connecting to ${config.app.port}`);
  } else {
    console.log(`Magic happens at port ${config.app.port}`);
  }

})

module.exports = app;