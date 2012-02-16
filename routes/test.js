/*
 * Test page and API.
 */
module.exports = function(app){

   // Capture the POSTed answer data and record it in the user's test
   app.post('/test/take/:id', auth.ensAuth, function(req, res){
      var data = JSON.parse(req.body.data);
      console.log("Body: %j", data);
      Test.addAnswers(req.params.id, req.user.id, data, function(err){
         res.json({err: err});
      });
   });

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

