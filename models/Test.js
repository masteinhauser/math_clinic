var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var User = require('./User');
var Answer = require('./Answer');

// Test/Worksheet Schema and declaration
var TestSchema = new Schema({
   ts: {type: Date, default: Date.now },
   user: {type: Schema.ObjectId, ref: 'User'},
   answers: [Answer]
});

mongo.model('Test', TestSchema);
var Test = mongo.model('Test');

exports.emptyTest = {
   "_id": "",
   ts: "",
   user: "",
   answers: [Answer]
}; 

exports.add = function(user, answers, callback){
   var newTest = new Test();

   newTest.ts = new Date();
   newTest.user = user;
   newTest.answers = answers;

   newTest.save(function(err){
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

exports.edit = function(ts, user, answers, callback){
  exports.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.ts = ts || doc.ts;
      doc.user = user || doc.user;
      doc.answers = answers || doc.answers;

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

exports.allTests = function(callback){
  Test.find({}, callback);
};

exports.forAll = function(doEach, done){
  Test.find({}, function(err, docs){
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
  Test.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};
