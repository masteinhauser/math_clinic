var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;
var bcrypt = require('bcrypt');

var userUtil = require('../utils/User');
var UserHelper = require('./helpers/User');

// User Schema and declaration
var User = exports.Schema = new Schema({
   username: String,
   password: String,
   role: {type: String, enum: UserHelper.UserType },
   fname: String,
   lname: String,
   birth: Date
});

User.emptyUser = {
   username: "",
   password: "",
   role: UserHelper.UserType[0], // Defaults to lowest permission user type
   fname: "",
   lname: "",
   birth: ""
};

User.statics.add = function add(username, password, role, fname, lname, birth, callback){
   userUtil.genPassword(password, password, function(err, hash){
      if(err){
         util.log("ERROR: "+err);
         callback(err);
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
         if(err){
            util.log('FATAL '+err);
            callback(err);
         } else {
            console.log('Saved %j', newUser);
            callback(err, newUser);
         }
      });
   });
};

User.statics.del = function del(id, callback){
  User.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      console.log("Removing User: %j", doc);
      doc.remove();
      callback(null);
    }
  });
};

User.statics.edit = function edit(id, username, password, role, fname, lname, birth, callback){
   User.findById(id, function(err, doc){
   if(err){
      callback(err);
   } else {
      var hash = null;
      if(password !== null && password !== "" && password != doc.password){
         userUtil.genPassword(password, password, function(err, hash){
            if(err){
               util.log("ERROR: "+err);
               throw err;
            }

            doc.username = username || doc.username;
            doc.password = hash;
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
         });
      }else{
         doc.username = username || doc.username;
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
    }
  });
};

User.statics.findAll = function(callback){
  User.find({}, callback);
};

User.statics.forAll = function(doEach, done){
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

User.statics.findById = function(id, callback){
  User.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

User.statics.findByUsername = function(username, callback){
  User.findOne({ username: username }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

var User = module.exports = mongo.model('User', User);
