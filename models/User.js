var util = require('util');
var async = require('async');
var mongo = require('mongoose');
var Schema = mongo.Schema;
var bcrypt = require('bcrypt');

var userUtil = require('../utils/User');
var UserHelper = require('./helpers/User');

// User Schema and declaration
var UserSchema = new Schema({
   username: String,
   password: String,
   role: {type: String, enum: UserHelper.UserType },
   fname: String,
   lname: String,
   birth: Date
});

var User = exports.User = mongo.model('User', UserSchema);

UserSchema.statics.emptyUser = {
   username: "",
   password: "",
   role: UserHelper.UserType[0], // Defaults to lowest permission user type
   fname: "",
   lname: "",
   birth: ""
};

UserSchema.statics.add = function(username, password, role, fname, lname, birth, callback){

   userUtil.genPassword(password, password, function(err, hash){
      if(err){
         util.log("ERROR: "+err);
         throw err;
      }

      var newUser = new User();
      newUser.username = username;
      newUser.password = hash;
      newUser.role = role;
      newUser.fname = fname;
      newUser.lname = lname;
      newUser.birth = birth;

      util.log('Trying to save...');
      newUser.save(function(err){
         console.log('Saved: ', newUser);
         if(err){
            util.log('FATAL '+err);
            callback(err);
         } else {
            console.log('Saved %j', newUser);
            callback();
         }
      });
   });
};

UserSchema.statics.del = function(id, callback){
  exports.findUserById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

UserSchema.statics.edit = function(id, username, password, role, fname, lname, birth, callback){
  exports.findUserById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.username = username || doc.username;
      doc.password = userUtil.genPassword(password) || doc.password;
      doc.role = role || doc.role;
      doc.fname = fname || doc.fname;
      doc.lname = lname || doc.lname;
      doc.birth = birth || doc.birth;

      doc.save(function(err){
        if(err){
          util.log('FATAL '+err);
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
};

UserSchema.statics.allUsers = function(callback){
  User.find({}, callback);
};

UserSchema.statics.forAll = function(doEach, done){
  User.find({}, function(err, docs){
    if(err){
      util.log('FATAL '+err);
      done(err, null);
    }

    docs.forEach(function(doc){
      doEach(null, doc);
    });

    done(null);
  });
};

var findById = UserSchema.statics.findById = function(id, callback){
  User.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

var findByUsername = UserSchema.statics.findByUsername = function(username, callback){
  User.findOne({ username: username }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

