/*
 * User edit page.
 */
var util = require('util');

module.exports = function(app){

   app.get('/users', auth.ensAuth, function(req, res){
      var i;
      User.findAll(function(err, docs){
         for(i = 0; i<docs.length; i++){
            if(typeof docs[i].password !== 'undefined'){
               var doc = docs[i];
               doc.password = '';
               delete doc.password;
               docs[i] = doc;
            }
         }
         res.json({err: err, users: docs});
      });
   });

   app.get('/user/edit/:id?', auth.ensAuth, function(req, res){
      var id;
      if(req.params.id){
         id = req.params.id;
      }else{
         id = req.user.id;
      }

      User.findById(id, function(err, user){
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

   app.post('/user/edit/:id?', auth.ensAuth, function(req, res){
      var id;
      if(req.params.id){
         id = req.params.id;
      }else if(req.body.id){
         id = req.body.id;
      }else{
         id = req.user.id;
      }

      // Disable changing the username, password, and role
      User.edit(id, null, null, null, req.body.fname, req.body.lname, req.body.birth, function(){});
      res.redirect(config.path+'/user/edit');
   });

   app.post('/user/add', auth.ensAuth, function(req, res){
      if(req.body.birth === ''){
         req.body.birth = new Date();
      }
      User.add(req.body.username, req.body.password, req.body.role, req.body.fname, req.body.lname, req.body.birth, function(err, user){
         console.log("User: %j", user);
         res.redirect(config.path+'/user/edit/'+user._id);
      });
   });
};

