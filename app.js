/**
 * Module dependencies.
 */
var express = require('express');
var mongo = require('mongoose');
var MongoStore = require('connect-mongo');
var db = require('./models/db');
global.config = require('./config');
global.app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('path', config.path);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
     store: new MongoStore({db: config.mongo.database, host: config.mongo.host, clear_interval: 14400}),
     secret: '08c0c045c37cb47793406f3056f1e96c',
     fingerprint: ''
  }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.dynamicHelpers({
   path: function(){
      return this.set('path');
   }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
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
