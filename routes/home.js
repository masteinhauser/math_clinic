/*
 * home page.
 */

module.exports = function(app){
   app.get('/', function(req, res){
      res.render('home.jade', { title: 'Math Clinic' });
   });
};

