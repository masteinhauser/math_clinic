var util = require('util');
var async = require('async');
var mongo = require('mongoose');
var Schema = mongo.Schema;
var bcrypt = require('bcrypt');
var userUtil = require('../utils/User');

// User Schema and declaration
var UserSchema = new Schema({
   username: String,
   password: String,
   fname: String,
   lname: String,
   birth: Date
});

var User = mongo.model('User', UserSchema);

exports.emptyUser = {
   username: "",
   password: "",
   fname: "",
   lname: "",
   birth: ""
};

exports.add = function(username, password, fname, lname, birth, callback){

   userUtil.genPassword(password, password, function(err, hash){
      if(err){
         util.log("ERROR: "+err);
         throw err;
      }

      var newUser = new User();
      newUser.username = username;
      newUser.password = hash;
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

exports.del = function(id, callback){
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

exports.edit = function(id, username, password, fname, lname, birth, callback){
  exports.findUserById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.username = username || doc.username;
      doc.password = userUtil.genPassword(password) || doc.password;
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

exports.allUsers = function(callback){
  User.find({}, callback);
};

exports.forAll = function(doEach, done){
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

var findById = exports.findById = function(id, callback){
  User.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

var findByUsername = exports.findByUsername = function(username, callback){
  User.findOne({ username: username }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

