var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var QuestionHelper = require('./helpers/Question');

// Question Schema and declaration
var Question = new Schema({
   type: {type: String, enum: QuestionHelper.QuestionType},
   level: {type: String, enum: QuestionHelper.QuestionLevel},
   equation: String
});

exports.emptyQuestion = {
   "_id": "",
   type: "",
   level: "",
   equation: ""
};

Question.statics.add = function add(type, level, equation, callback){
   var newQuestion = new Question();

   newQuestion.type = type;
   newQuestion.level = level;
   newQuestion.equation = equation;

   newQuestion.save(function(err){
      if(err){
         util.log('FATAL '+err);
         callback(err);
      } else {
         callback(null);
      }
   });
};

Question.statics.del = function del(id, callback){
  Question.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

Question.statics.edit = function edit(type, level, equation, callback){
  Question.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.type = type || doc.type;
      doc.level = level || doc.level;
      doc.equation = equation || doc.equation;

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

Question.statics.findAll = function findAll(callback){
  Question.find({}, callback);
};

Question.statics.forAll = function forAll(doEach, done){
  Question.find({}, function(err, docs){
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

Question.statics.findById = function findById(id, callback){
  Question.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

Question.statics.findByEquation = function findByEquation(eq, callback){
  Question.findOne({ equation: eq }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

var Question = module.exports = mongo.model('Question', Question);
