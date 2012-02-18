/*
 * Test page and API.
 */
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
         User.findById(test[0].user, function(err, user){
            if(err){
               result = {err: err};
            } else {
               result = {err: err, test: test, user:{username: user.username, name: user.fname+' '+user.lname}};
            }
            res.json(result);
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

