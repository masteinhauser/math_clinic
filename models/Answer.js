var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

// Answer Schema and declaration
var Answer = new Schema({
   latency: Date,
   correct: Boolean,
   question: String,
   answer: String,
   response: String
});

exports.emptyAnswer = {
   "_id": "",
   latency: "",
   correct: false,
   question: "",
   answer: "",
   response: ""
};

Answer.statics.add = function add(latency, correct, question, answer, response, callback){
   var newAnswer = new Answer();

   newAnswer.latency = latency;
   newAnswer.correct = correct;
   newAnswer.question = question;
   newAnswer.answer = answer;
   newAnswer.response = response;

   newAnswer.save(function(err){
      if(err){
         util.log('FATAL '+err);
         callback(err);
      } else {
         callback(null);
      }
   });
};

Answer.statics.del = function del(id, callback){
  Answer.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

Answer.statics.edit = function edit(latency, correct, question, answer, response, callback){
  Answer.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.latency = latency || doc.latency;
      doc.correct = correct || doc.correct;
      doc.question = question || doc.question;
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

Answer.statics.findAll = function findAll(callback){
  Answer.find({}, callback);
};

Answer.statics.forAll = function forAll(doEach, done){
  Answer.find({}, function(err, docs){
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

Answer.statics.findById = function findById(id, callback){
  Answer.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

var Answer = module.exports = mongo.model('Answer', Answer);

