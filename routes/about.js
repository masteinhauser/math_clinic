/*
 * about page.
 */


module.exports = function(app){
   app.get('/about', function(req, res){
      res.render('about.jade', { title: 'Math Clinic - About' });
   });
};


