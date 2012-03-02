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

      if(typeof req.body.password === 'undefined' || req.body.password === ''){
         req.body.password = null;
      }

      // Disable changing the username
      User.edit(id, null, req.body.password, req.body.role, req.body.fname, req.body.lname, req.body.birth, function(){});
      res.redirect(config.path+'/user/edit');
   });

   app.post('/user/del/:id?', auth.ensAuth, function(req, res){
      var id;
      if(req.params.id){
         id = req.params.id;
      }else if(req.body.id){
         id = req.body.id;
      }

      User.del(id, function(err){
         res.json({err: err});
      });
   });

   app.post('/user/add', auth.ensAuth, function(req, res){
      if(req.body.role === ''){
         req.body.role = 'student';
      }
      if(req.body.birth === ''){
         req.body.birth = new Date();
      }
      if(typeof req.body.password === 'undefined' || req.body.password === ''){
         console.log('Error with Pass: '+req.body.password);
         req.body.password = 'pass';
      }
      console.log('Pass: '+req.body.password);
      User.add(req.body.username, req.body.password, req.body.role, req.body.fname, req.body.lname, req.body.birth, function(err, user){
         console.log("Added User: %j", user);
         res.redirect(config.path+'/user/edit/'+user._id);
      });
   });
};

