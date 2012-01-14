/*
 * GET about page.
 */

module.exports = function(app){
   app.get('/', function(req, res){
      res.render('index.jade', { title: 'Math Clinic' });
   });
};

