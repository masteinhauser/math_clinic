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

   User.add("myles", "pass", "Myles", "Steinhauser", "07/01/1990", function(err){
      if(err){
         util.log("ERROR: "+err);
         return err;
      }
      util.log("Success!");
      db.disconnect(function(err){});
   });
});

