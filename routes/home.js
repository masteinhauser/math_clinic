/*
 * GET home page.
 */
var config = require('../config');

module.exports = function(app){
   app.get('/', function(req, res){
      res.render('home.jade', { title: 'Math Clinic' });
   });

   app.get(config.path+'/', function(req, res){
      res.render('home.jade', { title: 'Math Clinic' });
   });
};

