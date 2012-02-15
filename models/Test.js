var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var User = require('./User');
var Answer = require('./Answer');

// Test/Worksheet Schema and declaration
var Test = new Schema({
   ts: {type: Date, default: Date.now },
   user: {type: Schema.ObjectId, ref: 'User'},
   answers: [Answer]
});

exports.emptyTest = {
   "_id": "",
   ts: "",
   user: "",
   answers: [Answer]
}; 

Test.statics.add = function add(user, answers, callback){
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

Test.statics.del = function del(id, callback){
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

Test.statics.edit = function edit(ts, user, answers, callback){
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

Test.statics.findAll = function findAll(callback){
  Test.find({}, callback);
};

Test.statics.forAll = function forAll(doEach, done){
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

Test.statics.findById = function findById(id, callback){
  Test.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

var Test = module.exports = mongo.model('Test', Test);
