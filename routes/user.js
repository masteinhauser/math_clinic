/*
 * User edit page.
 */
var util = require('util');

module.exports = function(app){
   app.get('/user/edit', auth.ensAuth, function(req, res){
         User.findById(req.user.id, function(err, user){
            if(err){
               result = {success: false, message: err};
            } else {
               result = {success: true, user: user};
            }
            res.render('user.jade', {
               layout: false,
               req: req,
               title: 'Math Clinic - User',
               result: result
            });
         });
   });
   app.post('/user/edit', auth.ensAuth, function(req, res){
      User.edit(req.body.id, req.body.username, null, null, req.body.fname, req.body.lname, req.body.birth, function(){});
      res.redirect(config.path+'/user/edit');
   });
};

