var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var User = require('./User');

// Class Schema and declaration
var Class = new Schema({
   classname: String,
   school: String,
   grade: String,
   teachers: [{type: Schema.ObjectId, ref: 'User'}],
   students: [{ type: Schema.ObjectId, ref: 'User' }]
});

exports.emptyClass = {
   "_id": "",
   classname: "",
   school: "",
   grade: "",
   teachers: [User],
   students: [User]
};

Class.statics.add = function(classname, school, grade, teachers, students, callback){
   var newClass = new Class();

   newClass.classname = classname;
   newClass.school = school;
   newClass.grade = grade;
   newClass.teachers = teachers;
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

Class.statics.del = function(id, callback){
  Class.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

Class.statics.edit = function(classname, school, grade, teachers, students, callback){
  Class.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.username = classname || doc.classname;
      doc.students = school || doc.school;
      doc.grade = grade || doc.grade;
      doc.teachers = teachers || doc.teachers;
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

Class.statics.findAll = function(callback){
  Class.find({}, callback);
};

Class.statics.forAll = function(doEach, done){
  Class.find({}, function(err, docs){
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

Class.statics.findById = function(id, callback){
  Class.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

var Class = module.exports = mongo.model('Class', Class);
