/*
 * Authentication pages.
 */
var passport = require('passport');
var util = require('util');
var config = require('../config');

module.exports = function(app){
   app.get('/login', function(req, res){
      res.render('login.jade', {
         req: req,
         title: 'Math Clinic - Login' });
   });

   app.post('/login',
      passport.authenticate('local', { failureRedirect: '/login' }),
      function(req, res){
         res.render('login.jade', {
            layout: false,
            req: req,
            title: 'Math Clinic - Login' ,
            result: {
               success: true,
               message: "Thanks for logging in!"},
            config: config
         });
      }
   );

   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   });
};

