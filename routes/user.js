/*
 * User edit page.
 */
var util = require('util');
var config = require('../config');

module.exports = function(app){
   app.get('/user', auth.ensAuth, function(req, res){
         User.findById(req.user.id, function(err, user){
            if(err){
               result = {success: false, message: err};
            } else {
               result = {success: true, user: user};
            }
            res.render('user.jade', { req: req, title: 'Math Clinic - User' , result: result });
         });
   });
   app.post('/user', auth.ensAuth, function(req, res){
      User.edit();
   });
};

