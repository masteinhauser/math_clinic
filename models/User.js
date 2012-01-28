var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

// User Schema and declaration
var UserSchema = new Schema({
   username: String,
   fname: String,
   lname: String,
   birth: Date
});

mongo.model('User', UserSchema);
var User = mongo.model('User');

exports.emptyUser = {
   "_id": "",
   username: "",
   fname: "",
   lname: "",
   birth: ""
};

exports.add = function(username, fname, lname, birth, callback){
   var newUser = new User();

   newUser.username = username;
   newUser.fname = fname;
   newUser.lname = lname;
   newUser.birth = birth;

   newUser.save(function(err){
      if(err){
         util.log('FATAL '+err);
         callback(err);
      } else {
         callback(null);
      }
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

exports.edit = function(id, username, fname, lname, birth, callback){
  exports.findUserById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.username = username || doc.username;
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
