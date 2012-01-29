var bcrypt = require('bcrypt');

var getAge = exports.getAge = function(birth){
   // Found on Stack Overflow: http://stackoverflow.com/a/7091965/606600
   var today = new Date();
   var birthDate = new Date(birth);
   var age = today.getFullYear() - birthDate.getFullYear();
   var m = today.getMonth() - birthDate.getMonth();
   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
   }

   return age;
};

var genPassword = exports.genPassword = function(cleartext, confirm, callback){
   if(confirm && cleartext != confirm){
      message = "Please type the same password twice";
      return callback(message);
   }
   return bcrypt.genSalt(10, function(err, salt){
      if(err){
         return callback(err);
      }
      //return bcrypt.hash(cleartext, salt, function(err, hash){
      return bcrypt.hash("pass", salt, function(err, hash){
         if(err){
            return callback(err);
         }
         return callback(null, hash);
      });
   });
};

var validPassword = exports.validPassword = function(cleartext, password, callback){
   return bcrypt.compare(cleartext, password, function(err, res){
      if(err){
         return callback(err);
      }
      return callback(null, res);
   });
};
