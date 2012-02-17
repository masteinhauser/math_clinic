var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var User = require('mongoose').model('User');
var Answer = require('mongoose').model('Answer');
var UserSchema = require('./User').Schema;
var AnswerSchema = require('./Answer').Schema;

// Test/Worksheet Schema and declaration
var Test = new Schema({
   ts: {type: Date, default: Date.now },
   user: {type: Schema.ObjectId, ref: 'User'},
   answers: {type: [AnswerSchema]}
});

Test.statics.add = function(ts, user, callback){
   var newTest = new Test();

   newTest.ts = ts || new Date();
   newTest.user = user;
   newTest.answers = [];

   newTest.save(function(err){
      if(err){
         util.log('FATAL '+err);
         callback(err);
      } else {
         callback(null, newTest);
      }
   });
};

// ts = Timestamp of the current test
// answers = Array of Answers from the client to append to the test
Test.statics.addAnswers = function(ts, user, answers, callback){
   var i;

   Test.findByTimestamp(ts, user, function(err, doc){
      console.log("Err: %j", err);
      console.log("Doc: %j", doc);

      if(doc === null){
         Test.add(ts, user, function(err, doc){
            console.log("Err: %j", err);
            console.log("Doc: %j", doc);
            if(!err){}
               doc = Test.formatAndAddAnswers(answers, doc);

               doc.save(function(err){
                  if(err){
                     util.log('FATAL '+err);
                     callback(err);
                  } else {
                     console.log("Saved: %j", doc);
                     callback(null);
                  }
               });
            }
         );
      }else{
         doc = Test.formatAndAddAnswers(answers, doc);

         doc.save(function(err){
            if(err){
               util.log('FATAL '+err);
               callback(err);
            } else {
               console.log("Saved: %j", doc);
               callback(null);
            }
         });
      }
   });
};

Test.statics.formatAndAddAnswers = function(answers, doc){
   var i, ans;

   console.log("Pushing answers onto doc...");
   for(i=0; i<answers.length; i++){
      console.log("answers["+i+"]: %j", answers[i]);
      ans = Answer.create(answers[i].latency, answers[i].correct, answers[i].question, answers[i].answer, "");
      console.log("Answer: %j", ans);
      doc.answers.push(ans);
   }
   console.log("done.");

   return doc;
};

Test.statics.del = function(id, callback){
  Test.findById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

Test.statics.edit = function(ts, user, answers, callback){
  Test.findById(id, function(err, doc){
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

Test.statics.findAll = function(callback){
  Test.find({}, callback);
};

Test.statics.forAll = function(doEach, done){
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

Test.statics.findById = function(id, callback){
  Test.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

Test.statics.findByTimestamp = function(ts, user, callback){
  Test.findOne({ ts: ts, user: user}, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};

Test.statics.findByUserId = function(user, callback){
  Test.find({ user: user}, function(err, docs){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, docs);
  });
};

var Test = module.exports = mongo.model('Test', Test);
