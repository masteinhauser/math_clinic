var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

// Problem Schema and declaration
var ProblemSchema = new Schema({
   latency: Date,
   correct: Boolean,
   problem: String,
   answer: String,
   response: String
});

mongo.model('Problem', ProblemSchema);
var Problem = mongo.model('Problem');

exports.emptyProblem = {
   "_id": "",
   latency: "",
   correct: false,
   problem: "",
   answer: "",
   response: ""
};

exports.add = function(latency, correct, problem, answer, response, callback){
   var newProblem = new Problem();

   newProblem.latency = latency;
   newProblem.correct = correct;
   newProblem.problem = problem;
   newProblem.answer = answer;
   newProblem.response = response;

   newProblem.save(function(err){
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

exports.edit = function(latency, correct, problem, answer, response, callback){
  exports.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.latency = latency || doc.latency;
      doc.correct = correct || doc.correct;
      doc.problem = problem || doc.problem;
      doc.answer = answer || doc.answer;
      doc.response = response || doc.response;

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

exports.allProblems = function(callback){
  Problem.find({}, callback);
};

exports.forAll = function(doEach, done){
  Problem.find({}, function(err, docs){
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
  Problem.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};
