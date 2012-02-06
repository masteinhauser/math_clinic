/*
 * home page.
 */

module.exports = function(app){
   app.get('/', function(req, res){
      res.render('blank.jade', { title: 'Math Clinic' });
   });
};

