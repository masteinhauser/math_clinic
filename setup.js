var util = require('util');
var db = require('./models/db');
var mongo = require('mongoose');
var User = require('./models/User');

db.connect(function(err){
   if(err){
      throw err;
   }
});


db.setup(function(err){
   if(err){
      util.log("ERROR: "+err);
      throw error;
   }

   var user = new User();

   user.username = "myles";
   user.password = "pass";
   user.role = "admin";
   user.fname = "Myles";
   user.lname = "Steinhauser";
   user.birth = "07/01/1990";
   user.save(function(err){
      if(err){
         util.log("ERROR: "+err);
         return err;
      }
      util.log("Success!");
      db.disconnect(function(err){});
   });
});

