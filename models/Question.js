var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var QuestionHelper = require('./helpers/Question');
var QuestionHelpep = require('./helpers/Question');

// Question Schema and declaration
var QuestionSchema = new Schema({
   type: QuestionHelper.QuestionType,
   level: QuestionHelper.QuestionLevel,
   equation: String,
   result: String
});

mongo.model('Question', QuestionSchema);
var Question = mongo.model('Question');

exports.emptyQuestion = {
   "_id": "",
   type: "",
   level: "",
   equation: "",
   result: ""
};

exports.add = function(type, level, equation, result, callback){
   var newQuestion = new Question();

   newQuestion.type = type;
   newQuestion.level = level;
   newQuestion.equation = equation;
   newQuestion.result = result;

   newQuestion.save(function(err){
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

exports.edit = function(type, level, equation, result, callback){
  exports.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.type = type || doc.type;
      doc.level = level || doc.level;
      doc.equation = equation || doc.equation;
      doc.result = result || doc.result;

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

exports.allQuestions = function(callback){
  Question.find({}, callback);
};

exports.forAll = function(doEach, done){
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

var findById = exports.findById = function(id, callback){
  Question.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};
