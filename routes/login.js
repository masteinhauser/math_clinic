/*
 * Authentication pages.
 */
var passport = require('passport');
var util = require('util');

module.exports = function(app){
   app.get('/login', function(req, res){
      res.render('login.jade', { title: 'Math Clinic - Login' });
   });

   app.post('/login',
      passport.authenticate('local', { failureRedirect: '/login'}),
      function(req, res){
         console.log("req: %j", req);
         console.log("res: %j", res);
      }
   );

   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   });
};

