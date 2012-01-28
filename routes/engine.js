/*
 * GET Equation Engine page.
 */
var config = require('../config');

module.exports = function(app){
   app.get(config.path+'/engine', function(req, res){
      res.render('engine.jade', { title: 'Math Clinic - Equation Engine' });
   });
};

