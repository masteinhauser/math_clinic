/*
 * Login page.
 */

module.exports = function(app){
   app.get('/login', function(req, res){
      res.render('login.jade', { title: 'Math Clinic - Login' });
   });

   app.post('/login', function(req, res){
      res.cookie('math_login', 'AOK');
      var result = { success: true };

      res.render('login.jade', { req: req.body, title: 'Math Clinic - Login', result: result });
   });
};

