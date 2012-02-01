/**
 * Module dependencies.
 */
var express = require('express');
var mongo = require('mongoose');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo');
var db = require('./models/db');
global.config = require('./config');
global.app = module.exports = express.createServer();

// Configuration
app.configure(function(){
   app.use(express.cookieParser());
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(express.session({
      store: new MongoStore({db: config.mongo.database, host: config.mongo.host, clear_interval: 14400}),
      secret: '08c0c045c37cb47793406f3056f1e96c',
      fingerprint: ''
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   app.use(app.router);
   app.use(express.static(__dirname + '/public'));
   app.use(require('stylus').middleware({ src: __dirname + '/public' }));
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.set('basepath', config.path);
});

app.dynamicHelpers({
   user: function(req, res){
      return req.user || {};
   }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Authentication and Sessions
passport.use(new LocalStrategy(
   function(username, password, next){
      User.findOne({
         username: username
      }, function(err, user){
         if(err){
            return next(err);
         }
         if(!user){
            return next(null, false);
         }
         var userUtil = require('./utils/User');
         userUtil.validPassword(password, user.password, function(err, res){
            if(err){
               console.log("ERROR: "+err);
            }
            if(res){
               return next(null, user);
            } else {
               console.log("bad password");
               return next(null, false);
            }
         });
      });
   }
));
passport.serializeUser(function(user, next){
   next(null, user.username);
});
passport.deserializeUser(function(id, next){
   User.findOne(id, function(err, user){
      next(err, user);
   });
});

// Configure Error Pages
app.use(function(req, res, next){
   res.render('404.jade', {status: 404, url: req.url, title: 'Page Not Found'});
});
app.use(function(err, req, res, next){
   res.render('500.jade', {status: err.status || 500, url: req.url, title: 'Internal Server Error'});
});

// Setup Mongoose
global.conn = db.connect(function(err){
   if(err){
      throw err;
   }
});

// Models
global.User = mongo.model('User');
global.Class = mongo.model('Class');
global.Problem = mongo.model('Problem');
global.Question = mongo.model('Question');
global.Test = mongo.model('Test');

// Routes
// Dynamically search for and load all routes in ./routes
require('./routes')(app);

app.listen(config.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
