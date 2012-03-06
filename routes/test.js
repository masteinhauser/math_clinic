/*
 * Test page and API.
 */
var Util = require('../utils/Util');

module.exports = function(app){

   // Returns ALL tests, should be modified to limit to the current "class"/permissions
   app.get('/test', auth.ensAuth, function(req, res){
      var i;
      Test.findAll(function(err, test){
         res.json({err: err, test: test});
      });
   });

   // Get the details of a single test
   app.get('/test/single/:id', auth.ensAuth, function(req, res){
      var i;
      Test.findById(req.params.id, function(err, test){
         res.json({err: err, test: test});
      });
   });

   // Get all tests for a specified user id OR the current user's id.
   app.get('/test/user/:id?', auth.ensAuth, function(req, res){
      var id;
      if(req.params.id){
         id = req.params.id;
      }else{
         id = req.user.id;
      }

      Test.findByUserId(id, function(err, test){
         var calc = [];
         if(err){
            res.json({err: err});
         }else if(test.length === 0){
            res.json({err: 'No results found!'});
         }

         User.findById(test[0].user, function(err, user){
            if(err){
               res.json({err: err});
            }

            var i, j, k, answer;
            var digits, question, totalDigits;
            var totalLatency;
            var numCorrect;

            for(i=0; i<test.length; i++){
               calc[i] = {};
               digits = 0;
               totalDigits = 0;
               totalLatency = 0;
               numCorrect = 0;

               for(j=0; j<test[i].answers.length; j++){
                  answer = test[i].answers[j];
                  totalLatency += Number(answer.latency);
                  if(answer.correct){
                     numCorrect++;
                     totalDigits += answer.answer.length;
                  }else{
                     question = eval(answer.question);
                     digits = 0;
                     for(k=0; k<answer.answer.length && k<question.length; k++){
                        digits += (question[k] === answer.answer[k]? 1 : 0);
                     }
                     totalDigits += digits;
                  }
               }
               calc[i].digitsPerMinute = Util.round(totalDigits / (totalLatency/60000), 2);
               calc[i].avgLatency = Util.round(totalLatency / test[i].answers.length, 2);
               calc[i].totalLatency = totalLatency;
               calc[i].numCorrect = numCorrect;
            }

            res.json({err: err, test: test, calc: calc, user:{username: user.username, name: user.fname+' '+user.lname}});
         });
      });
   });

   // Capture the POSTed answer data and record it in the user's test based on timestamp and user id
   app.post('/test/take/:id', auth.ensAuth, function(req, res){
      var data = JSON.parse(req.body.data);
      Test.addAnswers(req.params.id, req.user.id, data, function(err){
         res.json({err: err});
      });
   });

   // Takes the posted data and creates a new test/question for it.
   // TODO: This should be modified to check if the equation already exists and return the question if it does
   app.post('/test/create/:eq/:type/:level', auth.ensAuth, function(req, res){
      Question.add(req.params.type, req.params.level, req.params.eq, function(err){
         var response;
         if(err){
            response = {success: false, err: err};
         }

         var question = Question.findByEquation(req.params.eq, function(err, question){
            response = {success: true, err: err, question: question};
            res.json(response);
         });
      });
   });

};

