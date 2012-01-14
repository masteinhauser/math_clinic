var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var User = require('./User');

// Class Schema and declaration
var ClassSchema = new Schema({
   classname: String,
   school: String,
   teacher: User,
   students: [User]
});

mongo.model('Class', ClassSchema);
var Class = mongo.model('Class');

exports.emptyClass = {
   "_id": "",
   classname: "",
   school: "",
   teacher: User,
   students: [User]
};

exports.add = function(classname, school, teacher, students, callback){
   var newClass = new Class();

   newClass.classname = classname;
   newClass.school = school;
   newClass.teacher = teacher;
   newClass.students = students;

   newClass.save(function(err){
      if(err){
         util.log('FATAL '+err);
         callback(err);
      } else {
         callback(null);
      }
   });
};

exports.del = function(id, callback){
  exports.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

exports.edit = function(classname, school, teacher, students, callback){
  exports.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.username = classname || doc.classname;
      doc.students = school || doc.school;
      doc.teacher = teacher || doc.teacher;
      doc.students = students || doc.students;

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

exports.allClasses = function(callback){
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
  Class.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};
