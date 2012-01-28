/*
 * GET about page.
 */
var config = require('../config');

module.exports = function(app){
   app.get(config.path+'/about', function(req, res){
      res.render('about.jade', { title: 'Math Clinic - About' });
   });
};


