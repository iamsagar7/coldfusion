var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config/index');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Index Route
app.use('/', indexRouter);
// About Route
app.use('/about', aboutRouter);



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

// render to edit ideas template
app.get('/ideas/edit/:id', (req, res, next) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
      });
    });



});
//edit Ideas
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          res.redirect('/ideas');
        });

    });

});
//Delete ideas
app.delete('/ideas/:id', (req, res) => {
  Idea.deleteOne({
      _id: req.params.id
    })
    .then(() => {
     
        res.redirect('/ideas');
    
    })
})
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